import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, ShoppingBag, ArrowRight, CreditCard, 
  ShieldCheck, Minus, Plus 
} from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getCartTotal, addToCart } = useContext(CartContext);
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

  const decreaseQtyHandler = (item) => {
    if (item.qty > 1) {
      addToCart(item, -1); 
    } else {
      removeFromCart(item._id);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-20 px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 text-slate-300">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3">Cart is empty</h2>
          <p className="text-slate-500 mb-8">Your shopping bag is waiting to be filled. Start exploring our latest collections!</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-600 transition-all">
            Explore Products <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">My Shopping Cart</h1>
            <p className="text-slate-500 font-medium">You have <span className="text-slate-900 font-bold">{cartItems.length} unique items</span> in your bag</p>
          </div>
          <button onClick={clearCart} className="text-rose-500 hover:text-rose-600 text-sm font-bold flex items-center gap-2 transition-colors">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          
          {/* LEFT: ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode='popLayout'>
              {cartItems.map((item) => (
                <motion.div 
                  layout
                  key={item._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-4 sm:p-6 rounded-4xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center"
                >
                  <Link to={`/products/${item._id}`} className="w-full sm:w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </Link>

                  <div className="flex flex-col grow w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link to={`/products/${item._id}`} className="text-xl font-bold hover:text-blue-600 transition-colors">{item.name}</Link>
                        <p className="text-slate-400 text-sm font-medium mt-1">{item.category}</p>
                      </div>
                      <span className="text-xl font-black text-slate-900">${(item.price * item.qty).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                      <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                        <button 
                          onClick={() => decreaseQtyHandler(item)}
                          className="p-2 bg-white rounded-lg shadow-sm hover:text-rose-500 transition-all active:scale-90"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-slate-800">{item.qty}</span>
                        <button 
                          onClick={() => addToCart(item, 1)}
                          disabled={item.qty >= item.countInStock}
                          className="p-2 bg-white rounded-lg shadow-sm hover:text-blue-600 transition-all active:scale-90 disabled:opacity-30"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(item._id)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-32">
              <h2 className="text-2xl font-black mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Tax (Estimated)</span>
                  <span className="text-slate-900">$0.00</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-lg font-bold">Order Total</span>
                  <span className="text-3xl font-black text-blue-600">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 mb-6"
              >
                Go to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-4 py-6 border-t border-slate-50">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Secure Checkout
                </div>
                <div className="flex gap-3 opacity-40">
                  <CreditCard className="w-8 h-8" />
                  <div className="w-10 h-6 bg-slate-200 rounded"></div>
                  <div className="w-10 h-6 bg-slate-200 rounded"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;