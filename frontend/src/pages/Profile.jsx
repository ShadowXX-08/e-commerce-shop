import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Package, 
  ChevronRight, Loader2, Settings, 
  Clock, ShieldCheck
} from 'lucide-react';
import InputField from '../components/InputField'; 

const Profile = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      setName(user?.name || '');
      setEmail(user?.email || '');
      fetchMyOrders();
    }
  }, [token, navigate, user]);

  const fetchMyOrders = async () => {
    try {
      const { data } = await apiService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Orders load error:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setUpdating(true);
    try {
      const updateData = { name, email };
      if (password.trim() !== '') {
        updateData.password = password;
      }

      const { data } = await apiService.updateUserProfile(updateData);
      const { token: newToken, ...userData } = data;
      localStorage.setItem('user', JSON.stringify(userData));
      if (newToken) localStorage.setItem('token', newToken);

      toast.success("Profile Updated Successfully!");
      setPassword('');
      setConfirmPassword('');
      
      // Ma'lumotlar yangilanishi uchun (Refresh-siz context yangilansa yaxshi, bo'lmasa reload)
      // window.location.reload(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Account Center</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your identity and track your shopping history</p>
          </div>
          <button 
            onClick={logout}
            className="text-rose-500 font-bold bg-rose-50 px-6 py-2.5 rounded-2xl hover:bg-rose-100 transition-all active:scale-95 border border-rose-100"
          >
            Log Out Account
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT: UPDATE PROFILE FORM */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Settings className="w-5 h-5" /></div>
                Personal Details
              </h2>

              <form onSubmit={updateProfileHandler}>
                <InputField 
                  label="Full Name" 
                  icon={User} 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your Name"
                />

                <InputField 
                  label="Email Address" 
                  icon={Mail} 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="email@example.com"
                />

                <div className="pt-6 mt-6 border-t border-slate-50 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Security Update</p>
                  
                  <InputField 
                    label="New Password" 
                    icon={Lock} 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                  />

                  <InputField 
                    label="Confirm New Password" 
                    icon={ShieldCheck} 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={updating}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:bg-slate-300 shadow-xl shadow-slate-900/10"
                >
                  {updating ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Profile Changes"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* RIGHT: ORDER HISTORY */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[500px]">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                <div className="p-2 bg-purple-50 rounded-xl text-purple-600"><Package className="w-5 h-5" /></div>
                My Purchases
              </h2>

              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <p className="text-slate-400 font-bold animate-pulse">Syncing your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Package className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-500 font-medium mb-6">No orders found in your history.</p>
                  <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link 
                      key={order._id} 
                      to={`/order/${order._id}`}
                      className="group flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all"
                    >
                      <div className="flex items-center gap-6 w-full">
                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                          <Clock className="w-7 h-7" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-slate-900 truncate">ORDER #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                          <span className="text-xs text-slate-400 font-bold uppercase mt-1">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-10 mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                        <div className="flex flex-col items-end shrink-0">
                           <span className="text-xl font-black text-slate-900">${order.totalPrice.toFixed(2)}</span>
                           <div className="flex gap-2 mt-1">
                              {order.isPaid ? (
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Paid</span>
                              ) : (
                                <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Unpaid</span>
                              )}
                              {order.isDelivered ? (
                                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Shipped</span>
                              ) : (
                                <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">Preparing</span>
                              )}
                           </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;