import { Link, useLocation } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ClipboardList } from 'lucide-react';
const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-20 pb-10 font-sans">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white max-w-md w-full p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center"
      >
        {/* Success Icon Animation */}
        <motion.div 
          initial={{ rotate: -45, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Success!</h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
          Your order has been placed successfully. <br/>
          We've sent the details to your email.
        </p>

        <div className="space-y-4">
          {orderId && (
            <Link 
              to={`/order/${orderId}`} 
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all"
            >
              <ClipboardList className="w-5 h-5" />
              View Order Details
            </Link>
          )}

          <Link 
            to="/products" 
            className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link 
            to="/" 
            className="block w-full text-slate-400 py-2 rounded-xl font-bold hover:text-slate-900 transition-all text-sm"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;