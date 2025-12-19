import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import InputField from '../components/InputField';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const result = await register(
        formData.name.trim(), 
        formData.email.trim().toLowerCase(), 
        formData.password
      );

      if (result.success) {
        toast.success('Welcome to D-SHOP!');
        navigate('/');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans pt-28 pb-12 px-4">
      
      {/* --- BACKGROUND BLOBS --- */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      {/* --- REGISTER CARD --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
               <span className="text-3xl font-black bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  D-SHOP
               </span>
            </Link>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Join our premium fashion community today.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <InputField
              label="Full Name"
              name="name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            {/* Email Address */}
            <InputField
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
            />

            {/* Password */}
            <InputField
              label="Password"
              name="password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
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

            {/* Confirm Password */}
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              icon={CheckCircle}
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:bg-slate-400 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register Now
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-black hover:underline transition-colors">
                Log In
              </Link>
            </p>
            <div className="pt-6 border-t border-slate-50">
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-relaxed">
                 By registering, you agree to our <br/> Terms of Service & Privacy Policy
               </p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;