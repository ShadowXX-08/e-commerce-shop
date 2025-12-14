import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-20 pb-10 font-sans">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white max-w-md w-full p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 text-center"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4">Thank You!</h1>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Your order has been placed successfully. <br/>
          We are preparing your package!
        </p>

        <div className="space-y-3">
          <Link 
            to="/products" 
            className="block w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-600 hover:shadow-blue-600/30 transition-all"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/" 
            className="block w-full bg-white text-slate-600 py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;