import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Package, 
  ChevronRight, Loader2, Settings, 
  Clock, CheckCircle, XCircle 
} from 'lucide-react';

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
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setUpdating(true);
    try {
      const { data } = await apiService.updateUserProfile({
        name,
        email,
        password,
      });
      
      localStorage.setItem('user', JSON.stringify(data));
      toast.success("Profile Updated Successfully!");
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">My Profile</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your account and track your orders</p>
          </div>
          <button 
            onClick={logout}
            className="text-rose-500 font-bold bg-rose-50 px-6 py-2.5 rounded-xl hover:bg-rose-100 transition-all active:scale-95"
          >
            Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* --- LEFT: UPDATE PROFILE FORM --- */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Settings className="w-5 h-5" /></div>
                Account Settings
              </h2>

              <form onSubmit={updateProfileHandler} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-4">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Change Password</p>
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={updating}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                  {updating ? <Loader2 className="animate-spin" /> : "Update Profile"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* --- RIGHT: ORDER HISTORY --- */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 min-h-[500px]">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Package className="w-5 h-5" /></div>
                Order History
              </h2>

              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  <p className="text-slate-400 font-medium">Fetching your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-4xl border border-dashed border-slate-200">
                  <p className="text-slate-500 mb-4">You haven't placed any orders yet.</p>
                  <Link to="/products" className="text-blue-600 font-bold hover:underline">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link 
                      key={order._id} 
                      to={`/order/${order._id}`}
                      className="group flex flex-col sm:flex-row items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-5 w-full">
                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-8 mt-4 sm:mt-0">
                        <div className="flex flex-col items-end">
                           <span className="text-lg font-black text-slate-900">${order.totalPrice.toFixed(2)}</span>
                           <div className="flex gap-2">
                              {order.isPaid ? (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Paid</span>
                              ) : (
                                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase">Unpaid</span>
                              )}
                              {order.isDelivered ? (
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Delivered</span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full uppercase">Processing</span>
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