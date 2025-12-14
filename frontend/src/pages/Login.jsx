import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
// YANGI: Eye va EyeOff ikonkalari qo'shildi
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // YANGI: Parolni ko'rsatish/yashirish uchun state
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans pt-28 pb-12 px-4">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      {/* --- LOGIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.1)] border border-white/50 relative z-10">
          
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-4">
              <span className="text-3xl font-black bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
                D-SHOP
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back!</h2>
            <p className="text-slate-500 mt-2 text-sm">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="name@example.com" 
                  required 
                />
              </div>
            </div>

            {/* Password Input (O'ZGARTIRILDI) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                {/* Chap tarafdagi qulf ikonka */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                
                <input 
                  // Input turi dinamik o'zgaradi (text yoki password)
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  // pr-12 qo'shildi (o'ngdagi ikonka yozuv ustiga chiqmasligi uchun)
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="••••••••" 
                  required 
                />

                {/* YANGI: Ko'zchani bosish tugmasi */}
                <button
                  type="button" // Form submit bo'lib ketmasligi uchun 'button' type berish shart
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" /> // Agar ochiq bo'lsa, yopish ikonkasini ko'rsat
                  ) : (
                    <Eye className="h-5 w-5" />   // Agar yopiq bo'lsa, ochish ikonkasini ko'rsat
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline hover:text-blue-700 transition-colors">
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400">
                Protected by reCAPTCHA and subject to the D-SHOP <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
             </p>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
};

export default Login;