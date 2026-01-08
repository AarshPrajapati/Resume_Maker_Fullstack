import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import AuthLayout from "../components/AuthLayout";
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
    <AuthLayout title="Welcome Back">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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

      <Link to="/forgot-password" className="text-sm link-text block text-right mb-4">
        Forgot password?
      </Link>

      <button onClick={login} disabled={loading} className="primary-btn">
        {loading ? "Logging in..." : "Login"}
      </button>

      <button onClick={googleLogin} disabled={loading} className="secondary-btn">
        Continue with Google
      </button>

      <p className="text-center text-sm text-slate-300">
        Don’t have an account? <Link to="/signup" className="link-text font-medium">Sign up</Link>
      </p>
    </AuthLayout>
  );
}
