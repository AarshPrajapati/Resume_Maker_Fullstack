import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import AuthCard from "../components/AuthCard";
import { authErrorMessage } from "../utils/authErrors";

const provider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(authErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
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
    <AuthCard title="Welcome Back">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
      <Link
          to="/forgot-password"
          className="text-sm text-indigo-600 block text-right mb-4"
        >
          Forgot password?
        </Link>

      <button
        onClick={login}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded mb-3 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <button
        onClick={googleLogin}
        disabled={loading}
        className="border w-full py-3 rounded mb-4"
      >
        Continue with Google
      </button>

      <p className="text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-indigo-600 font-medium">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
