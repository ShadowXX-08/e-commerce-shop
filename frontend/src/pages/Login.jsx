import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import InputField from "../components/InputField";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      toast.success("Welcome back to D-SHOP!");
      navigate("/");
    } else {
      toast.error(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans pt-28 pb-12 px-4">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-4">
              <span className="text-3xl font-black bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
                D-SHOP
              </span>
            </Link>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              Log in to manage your orders and profile.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email InputField orqali */}
            <InputField
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />

            {/* Password InputField orqali */}
            <InputField
              label="Password"
              name="password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <div className="flex justify-end -mt-3 mb-5">
              <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center space-y-4">
            <p className="text-sm text-slate-500 font-medium">
              New to D-SHOP?{" "}
              <Link to="/register" className="text-blue-600 font-black hover:underline">
                Create Account
              </Link>
            </p>
            <div className="pt-6 border-t border-slate-50">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Secure Encryption Enabled
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;