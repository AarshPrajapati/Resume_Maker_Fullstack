
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import AuthLayout from "../components/AuthLayout";
import { authErrorMessage } from "../utils/authErrors";

const provider = new GoogleAuthProvider();

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name || "User" });
      await sendEmailVerification(res.user);

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
    <AuthLayout title="Create Your Account">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <input
        className="input-field"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="input-field"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="input-field"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={signup} disabled={loading} className="primary-btn">
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <button onClick={googleSignup} disabled={loading} className="secondary-btn">
        Continue with Google
      </button>

      <p className="text-center text-sm text-slate-300">
        Already have an account?{" "}
        <Link to="/login" className="link-text font-medium">Login</Link>
      </p>
    </AuthLayout>
  );
}

