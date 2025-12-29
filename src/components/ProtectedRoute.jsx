import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, dbUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Email/password users must verify email
  const isPasswordUser = user.providerData.some(
    (p) => p.providerId === "password"
  );

  if (isPasswordUser && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Wait for backend user
  if (!dbUser) return null;

  // 🚨 Allow onboarding page itself
  if (
    !dbUser.onboardingCompleted &&
    location.pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
