import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Email/password users must verify
  const isPasswordUser =
    user.providerData.some((p) => p.providerId === "password");

  if (isPasswordUser && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}
