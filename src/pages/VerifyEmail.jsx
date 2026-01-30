import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/ui/Button";
import { Mail } from "lucide-react";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    const checkVerification = async () => {
      if (!auth.currentUser) return navigate("/login", { replace: true });
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) navigate("/", { replace: true });
      setLoading(false);
    };
    checkVerification();
    interval = setInterval(checkVerification, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  const resendEmail = async () => {
    try {
      setSending(true);
      if (auth.currentUser) await sendEmailVerification(auth.currentUser);
      alert("Verification email resent.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthLayout 
      title="Check your inbox" 
      subtitle="Verify your email to continue"
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-indigo-400" />
        </div>
        
        <p className="text-slate-300 mb-8 leading-relaxed">
          We’ve sent a verification link to <span className="text-white font-medium">{auth.currentUser?.email}</span>.<br />
          Click the link in the email to activate your account.
        </p>

        <Button 
          onClick={resendEmail} 
          isLoading={sending} 
          className="w-full"
        >
          Resend Verification Email
        </Button>
        
        <p className="mt-4 text-xs text-slate-500">
          Can't find it? Check your spam folder.
        </p>
      </div>
    </AuthLayout>
  );
}
