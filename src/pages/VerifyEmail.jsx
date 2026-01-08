import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import AuthLayout from "../components/AuthLayout";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let interval;
    const checkVerification = async () => {
      if (!auth.currentUser) return navigate("/login", { replace: true });
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) navigate("/", { replace: true });
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
    <AuthLayout title="Verify Your Email">
      <p className="text-slate-300 mb-4">
        We’ve sent a verification link to your email.<br />
        Once verified, you’ll be redirected automatically.
      </p>

      <button onClick={resendEmail} disabled={sending} className="primary-btn">
        {sending ? "Sending..." : "Resend Email"}
      </button>
    </AuthLayout>
  );
}
