import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, LogOut, User, Menu, X, ShieldCheck, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', to: '/' },
    { name: 'Products', to: '/products' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' 
          : 'bg-white/50 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* --- LOGO --- */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-3xl font-black tracking-tighter">
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text drop-shadow-sm">
                D-SHOP
              </span>
            </Link>
          </motion.div>

          {/* --- DESKTOP LINKS --- */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.name} to={link.to} className="relative group py-2">
                <span className={`text-sm font-bold uppercase tracking-wide transition-colors duration-300 ${
                  location.pathname === link.to ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                }`}>
                  {link.name}
                </span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 origin-left ${
                  location.pathname === link.to ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* --- RIGHT SIDE (Cart & Auth) --- */}
          <div className="hidden md:flex items-center gap-5">
            
            {/* Cart Icon */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/cart" className="relative p-0.5 text-slate-600 hover:text-blue-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <AnimatePresence>
                  {cartItems.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-linear-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md border border-white"
                    >
                      {cartItems.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            <div className="w-px h-6 bg-slate-200"></div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 hover:bg-amber-100 transition tracking-widest"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    ADMIN
                  </Link>
                )}
                
                {/* USER PROFILE LINK & LOGOUT */}
                <div className="flex items-center gap-1 pl-1 pr-1 py-1 rounded-full bg-slate-100 border border-slate-200">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 pl-2 pr-3 py-1 hover:bg-white rounded-full transition-all group"
                    title="My Profile"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate group-hover:text-blue-600">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </Link>

                  <motion.button 
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    onClick={handleLogout} 
                    className="p-1.5 bg-white text-rose-500 rounded-full shadow-sm hover:text-rose-600 transition border border-transparent hover:border-rose-100"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-600 font-semibold hover:text-blue-600 px-2">Login</Link>
                <Link to="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-medium shadow-lg hover:bg-slate-800 transition-all">Register</Link>
              </div>
            )}
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center gap-4">
             <Link to="/cart" className="relative text-slate-700">
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg bg-slate-100 text-slate-700">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 space-y-4">
              {links.map((link) => (
                <Link key={link.name} onClick={() => setMobileOpen(false)} to={link.to} className={`block text-lg font-bold ${location.pathname === link.to ? 'text-blue-600 border-l-4 border-blue-600 pl-3' : 'text-slate-600'}`}>
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-slate-100 my-4 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                     {/* PROFILE LINK MOBILE */}
                     <Link 
                        onClick={() => setMobileOpen(false)} 
                        to="/profile" 
                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                     >
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                           <User className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">My Account</span>
                           <span className="font-bold text-slate-800">{user?.name}</span>
                        </div>
                        <Settings className="w-5 h-5 ml-auto text-slate-300" />
                     </Link>
                    
                    {user?.isAdmin && (
                      <Link onClick={() => setMobileOpen(false)} to="/admin" className="block w-full text-center text-amber-700 bg-amber-50 py-3 rounded-xl font-black text-xs tracking-widest border border-amber-100">
                        ADMIN PANEL
                      </Link>
                    )}
                    
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-rose-600 bg-rose-50 py-3 rounded-xl font-bold hover:bg-rose-100 transition">
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link onClick={() => setMobileOpen(false)} to="/login" className="text-center py-3 rounded-xl bg-slate-100 text-slate-700 font-bold">Login</Link>
                    <Link onClick={() => setMobileOpen(false)} to="/register" className="text-center py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;