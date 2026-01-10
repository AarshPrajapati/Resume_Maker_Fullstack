import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onIdTokenChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDbUser = async (firebaseUser) => {
    const token = await firebaseUser.getIdToken();

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/me`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setDbUser(data);
  };

  useEffect(() => {
  const unsub = onIdTokenChanged(auth, async (firebaseUser) => {
    setUser(firebaseUser);

    if (firebaseUser) {
      // fire fetchDbUser in background — do NOT block UI
      fetchDbUser(firebaseUser).catch(err => console.error("Backend sync failed", err));
    } else {
      setDbUser(null);
    }

    // Always set loading false immediately
    setLoading(false);
  });

  return unsub;
  }, []);


  const refreshUser = async () => {
    if (auth.currentUser) {
      await fetchDbUser(auth.currentUser);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setDbUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
