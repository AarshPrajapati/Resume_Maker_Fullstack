import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { authErrorMessage } from "../utils/authErrors";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      await sendPasswordResetEmail(auth, email);
      setMessage("If an account exists with this email, you will receive a password reset link shortly.");
    } catch (err) {
      setError(authErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Password"
      subtitle="Enter your email to receive instructions"
    >
      {error && (
        <div className="p-4 mb-6 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
          {error}
        </div>
      )}
      {message && (
        <div className="p-4 mb-6 text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          {message}
        </div>
      )}

      <div className="space-y-6">
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
        />

        <Button 
          onClick={resetPassword} 
          isLoading={loading} 
          className="w-full"
        >
          Send Reset Link
        </Button>

        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
