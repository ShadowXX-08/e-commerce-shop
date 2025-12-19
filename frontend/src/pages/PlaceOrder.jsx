import { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CreditCard, 
  Package, 
  ChevronRight, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, paymentMethod, clearCart, getCartTotal } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = getCartTotal();
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/checkout');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [navigate, shippingAddress, cartItems]);

  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode || '123456',
          country: shippingAddress.country || 'Uzbekistan',
        },
        paymentMethod: paymentMethod,
        itemsPrice: Number(itemsPrice),
        shippingPrice: Number(shippingPrice),
        taxPrice: Number(taxPrice),
        totalPrice: Number(totalPrice),
      };

      const { data } = await apiService.createOrder(orderData);
      
      clearCart(); 
      toast.success('Order placed successfully!');
      navigate('/success', { state: { orderId: data._id } });
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Order process failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">
          <Link to="/cart" className="hover:text-blue-600">01 Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/checkout" className="hover:text-blue-600">02 Shipping</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900">03 Place Order</span>
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Final Review</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. SHIPPING INFO */}
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg"><MapPin className="w-5 h-5 text-blue-600" /></div>
                Shipping Destination
              </h2>
              <div className="grid sm:grid-cols-2 gap-6 text-slate-600">
                 <div>
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Customer</p>
                    <p className="font-bold text-slate-900">{shippingAddress.fullName || "Guest User"}</p>
                    <p className="text-sm">{shippingAddress.phone}</p>
                 </div>
                 <div>
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Address</p>
                    <p className="font-bold text-slate-900">{shippingAddress.address}</p>
                    <p className="text-sm">{shippingAddress.city}, {shippingAddress.postalCode || ''}</p>
                 </div>
              </div>
            </div>

            {/* 2. PAYMENT */}
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg"><CreditCard className="w-5 h-5 text-emerald-600" /></div>
                Payment Method
              </h2>
              <p className="text-slate-600 ml-11">
                Preferred method: <span className="font-black text-slate-900 uppercase">{paymentMethod}</span>
              </p>
            </div>

            {/* 3. ORDER ITEMS */}
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg"><Package className="w-5 h-5 text-purple-600" /></div>
                Review Items
              </h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-2xl border border-slate-100" />
                      <div>
                        <Link to={`/products/${item._id}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-sm text-slate-500 font-medium">{item.qty} units x ${item.price}</p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-32">
              <h3 className="text-2xl font-black mb-8">Billing Summary</h3>
              
              <div className="space-y-4 mb-8 text-slate-400 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">${addDecimals(itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="text-emerald-400 font-bold">
                    {shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (15%)</span>
                  <span className="text-white">${taxPrice}</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Grand Total</span>
                  <span className="text-3xl font-black text-blue-400">${totalPrice}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 mb-8 flex items-start gap-3 border border-white/10">
                 <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                   DEMO MODE: No real funds will be deducted. By clicking "Place Order", you agree to our terms.
                 </p>
              </div>

              <button
                disabled={cartItems.length === 0 || loading}
                onClick={placeOrderHandler}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:bg-slate-700 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "COMPLETE ORDER"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;