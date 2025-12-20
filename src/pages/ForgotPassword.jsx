import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import AuthCard from "../components/AuthCard";
import { authErrorMessage } from "../utils/authErrors";
import { Link } from "react-router-dom";

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
    <AuthCard title="Reset Password">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

      <input
        className="w-full border p-3 rounded mb-4"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={resetPassword}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <p className="text-center text-sm mt-4">
        <Link to="/login" className="text-indigo-600">Back to Login</Link>
      </p>
    </AuthCard>
  );
}
