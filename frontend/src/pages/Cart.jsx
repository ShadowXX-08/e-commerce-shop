import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, ShoppingBag, ArrowRight, CreditCard, 
  ShieldCheck, Package 
} from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout");
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  // --- EMPTY STATE (Savatcha bo'sh bo'lsa) ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-20 pb-10 px-4 font-sans">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
            <ShoppingBag className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Your cart is empty</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet. 
            Explore our products and find something you love!
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 transition-all hover:-translate-y-1"
          >
            Start Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // --- CART CONTENT ---
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 flex items-center gap-3">
          Shopping Cart
          <span className="text-lg font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
            {cartItems.length} items
          </span>
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* --- LEFT SIDE: CART ITEMS --- */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode='popLayout'>
              {cartItems.map((item) => (
                <motion.div 
                  layout
                  key={item._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="group flex flex-col sm:flex-row gap-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                    <img 
                      src={item.image || "https://placehold.co/150"} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col grow justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">
                          {item.name}
                        </h3>
                        <span className="font-bold text-lg text-slate-900">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{item.category || "Fashion"}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Display */}
                      <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                         <span className="text-xs font-bold text-slate-500 uppercase">Qty:</span>
                         <span className="text-sm font-bold text-slate-900">{item.qty}</span>
                         {/* Agar +/- funksiyasi bo'lsa shu yerga qo'shiladi */}
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item._id)} 
                        className="flex items-center gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors font-medium text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart Button */}
            {cartItems.length > 0 && (
              <div className="flex justify-end">
                <button 
                  onClick={clearCart} 
                  className="text-slate-400 hover:text-rose-500 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Shopping Cart
                </button>
              </div>
            )}
          </div>

          {/* --- RIGHT SIDE: ORDER SUMMARY --- */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 lg:sticky lg:top-32"
          >
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (Estimate)</span>
                  <span className="font-semibold">$0.00</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-800">Total</span>
                  <span className="text-2xl font-black text-slate-900">${getCartTotal().toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 text-right">Includes all taxes and fees</p>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-col gap-3">
                 <div className="flex items-center gap-2 text-slate-500 text-xs justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Secure SSL Encryption</span>
                 </div>
                 <div className="flex justify-center gap-4 opacity-50 grayscale">
                    {/* Shunchaki vizual ikonka o'rnida oddiy textlar yoki SVGlar */}
                    <CreditCard className="w-8 h-8" /> 
                    {/* Bu yerga haqiqiy Visa/Mastercard logolarini qo'yish mumkin */}
                 </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;