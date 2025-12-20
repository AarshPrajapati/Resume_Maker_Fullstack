import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import AuthCard from "../components/AuthCard";
import { authErrorMessage } from "../utils/authErrors";
import { updateProfile } from "firebase/auth";


const provider = new GoogleAuthProvider();

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async () => {
  try {
    setError("");
    setMessage("");
    setLoading(true);

    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, {
      displayName: name || "User",
    });
    await sendEmailVerification(res.user);

    // ✅ Redirect immediately
    navigate("/verify-email", { replace: true });

  } catch (err) {
    setError(authErrorMessage(err.code));
  } finally {
    setLoading(false);
  }
};


  const googleSignup = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(authErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create Your Account">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Full name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border p-3 rounded mb-4"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={signup}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded mb-3 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>

      <button
        onClick={googleSignup}
        disabled={loading}
        className="border w-full py-3 rounded mb-4"
      >
        Continue with Google
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 font-medium">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
