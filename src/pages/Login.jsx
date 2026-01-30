import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import AuthLayout from "../components/AuthLayout";
import { authErrorMessage } from "../utils/authErrors";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

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
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Enter your credentials to access your account"
    >
      {error && (
        <div className="p-4 mb-6 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
        />

        <div>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            className="mb-2"
          />
          <Link 
            to="/forgot-password" 
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors block text-right"
          >
            Forgot password?
          </Link>
        </div>

        <Button 
          onClick={login} 
          isLoading={loading} 
          className="w-full mt-2"
        >
          Sign In
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
          </div>
        </div>

        <Button 
          onClick={googleLogin} 
          disabled={loading} 
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
        >
          <FcGoogle size={20} />
          Sign in with Google
        </Button>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
