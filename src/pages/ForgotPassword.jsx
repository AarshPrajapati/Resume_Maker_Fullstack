import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { authErrorMessage } from "../utils/authErrors";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage("If an account exists with this email, you will receive a password reset link shortly.");
    } catch (err) {
      setError(authErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

      <input
        className="input-field mb-4"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={resetPassword} disabled={loading} className="primary-btn">
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <p className="text-center text-slate-300 mt-4">
        <Link to="/login" className="link-text">Back to Login</Link>
      </p>
    </AuthLayout>
  );
}
