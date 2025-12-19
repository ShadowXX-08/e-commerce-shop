import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Loader2, 
  MapPin, 
  User, 
  Mail, 
  Package, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  Truck,
  ArrowLeft
} from 'lucide-react';

const OrderScreen = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await apiService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const successPaymentHandler = async () => {
    setLoadingPay(true);
    try {
      const paymentResult = {
        id: `PAY_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: order?.user?.email,
      };
      
      const { data } = await apiService.payOrder(id, paymentResult);
      setOrder(data);
      toast.success('Payment Successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoadingPay(false);
    }
  };

  const deliverHandler = async () => {
    setLoadingDeliver(true);
    try {
      const { data } = await apiService.deliverOrder(id);
      setOrder(data);
      toast.success('Order Delivered!');
    } catch (error) {
      toast.error('Error updating delivery status');
    } finally {
      setLoadingDeliver(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-28">
        <XCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <Link to="/products" className="text-blue-600 hover:underline mt-4">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <Link to="/profile" className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                   <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Order <span className="text-blue-600">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                </h1>
             </div>
             <p className="text-slate-500 text-sm font-medium ml-11">
               Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
             </p>
          </div>
          <div className="flex items-center gap-2">
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {order.isPaid ? 'Paid' : 'Awaiting Payment'}
             </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. SHIPPING & CUSTOMER */}
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-200">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                 <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><User className="w-5 h-5" /></div>
                 Customer Information
               </h2>
               <div className="grid md:grid-cols-2 gap-8 text-sm">
                  <div className="space-y-4">
                     <div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Full Name</p>
                        <p className="font-bold text-slate-900 text-base">{order.user?.name}</p>
                     </div>
                     <div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Email Address</p>
                        <p className="font-medium text-blue-600">{order.user?.email}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Shipping Address</p>
                        <p className="font-bold text-slate-900 leading-relaxed">
                          {order.shippingAddress.address}, {order.shippingAddress.city}<br/>
                          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Delivery Badge */}
               <div className={`mt-8 p-5 rounded-2xl flex items-center gap-4 border ${order.isDelivered ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                  {order.isDelivered ? <CheckCircle className="w-6 h-6 shrink-0" /> : <Truck className="w-6 h-6 shrink-0 animate-pulse" />}
                  <div>
                    <p className="font-black uppercase text-xs tracking-widest">{order.isDelivered ? "Successfully Delivered" : "In Transit / Processing"}</p>
                    {order.isDelivered ? <p className="text-sm opacity-80 mt-1">Received on {new Date(order.deliveredAt).toLocaleString()}</p> : <p className="text-sm opacity-80 mt-1">Your package is being prepared for shipment.</p>}
                  </div>
               </div>
            </div>

            {/* 2. PAYMENT */}
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                 <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><CreditCard className="w-5 h-5" /></div>
                 Payment Status
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium text-sm text-nowrap">Method:</span>
                    <span className="font-black uppercase text-slate-900 tracking-wider">{order.paymentMethod}</span>
                 </div>
                 
                 <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border ${order.isPaid ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                     {order.isPaid ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                     <span className="font-black uppercase text-xs tracking-widest">{order.isPaid ? "Payment Confirmed" : "Pending Payment"}</span>
                 </div>
              </div>
              {order.isPaid && <p className="text-xs text-slate-400 mt-4 text-center">Paid on {new Date(order.paidAt).toLocaleString()}</p>}
            </div>

            {/* 3. ITEMS */}
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-200">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                 <div className="p-2 bg-purple-50 rounded-xl text-purple-600"><Package className="w-5 h-5" /></div>
                 Ordered Items
               </h2>
               <div className="divide-y divide-slate-50">
                 {order.orderItems.map((item, index) => (
                   <div key={index} className="flex items-center justify-between py-5 group">
                     <div className="flex items-center gap-5">
                       <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-2xl bg-slate-100 border border-slate-50" />
                       <div>
                         <Link to={`/products/${item.product}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                           {item.name}
                         </Link>
                         <p className="text-sm text-slate-400 font-medium">
                           {item.qty} x ${item.price.toFixed(2)}
                         </p>
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
                <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-4">Billing Details</h3>
                
                <div className="space-y-4 mb-8 text-slate-400 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">${order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-white">${order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="text-white">${order.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xl font-bold text-white">Total Amount</span>
                    <span className="text-3xl font-black text-blue-400">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Simulation Mode Info */}
                {!order.isPaid && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                    <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                      DEMO MODE: No real funds will be deducted. Click the button below to simulate a successful transaction.
                    </p>
                  </div>
                )}

                {/* PAY BUTTON */}
                {!order.isPaid && (
                  <button
                    onClick={successPaymentHandler}
                    disabled={loadingPay}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    {loadingPay ? <Loader2 className="animate-spin" /> : "COMPLETE PAYMENT"}
                  </button>
                )}

                {/* ADMIN ACTIONS */}
                {user?.isAdmin && order.isPaid && !order.isDelivered && (
                  <button
                    onClick={deliverHandler}
                    disabled={loadingDeliver}
                    className="w-full mt-4 bg-white/10 border border-white/20 text-white py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                  >
                    {loadingDeliver ? <Loader2 className="animate-spin" /> : "MARK AS DELIVERED"}
                  </button>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderScreen;