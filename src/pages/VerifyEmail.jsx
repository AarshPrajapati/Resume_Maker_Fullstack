import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let interval;

    const checkVerification = async () => {
      if (!auth.currentUser) {
        navigate("/login", { replace: true });
        return;
      }

      await auth.currentUser.reload(); // Refresh user info
      if (auth.currentUser.emailVerified) {
        navigate("/", { replace: true });
      }
    };

    // Run immediately, then every 3s
    checkVerification();
    interval = setInterval(checkVerification, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  const resendEmail = async () => {
    try {
      setSending(true);
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        alert("Verification email resent.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">Verify your email</h2>
        <p className="text-gray-600 mb-4">
          We’ve sent a verification link to your email.
          <br />
          Once verified, you’ll be redirected automatically.
        </p>

        <button
          onClick={resendEmail}
          disabled={sending}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {sending ? "Sending..." : "Resend Email"}
        </button>
      </div>
    </div>
  );
}
