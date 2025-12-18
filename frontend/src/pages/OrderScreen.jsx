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
  Truck
} from 'lucide-react';

const OrderScreen = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  useEffect(() => {
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

    fetchOrder();
  }, [id]);

  // --- MOCK PAYMENT HANDLER ---
  const successPaymentHandler = async () => {
    setLoadingPay(true);
    try {
      const paymentResult = {
        id: `PAY_${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: order.user.email,
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

  // --- ADMIN: MARK AS DELIVERED ---
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <div className="pt-28 text-center text-red-500">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
             <h1 className="text-2xl md:text-3xl font-black text-slate-900">
               Order <span className="text-blue-600">#{order._id.substring(0, 10)}...</span>
             </h1>
             <p className="text-slate-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <Link to="/profile" className="text-sm font-semibold text-blue-600 hover:underline">
            Back to Profile
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: DETAILS --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. SHIPPING INFO */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
               <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <User className="w-5 h-5 text-blue-600" /> Customer & Shipping
               </h2>
               <div className="space-y-3 ml-1 text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">Name:</span> {order.user.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">Email:</span> 
                    <a href={`mailto:${order.user.email}`} className="text-blue-500 hover:underline">{order.user.email}</a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-800 shrink-0">Address:</span> 
                    <span>
                      {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </span>
                  </div>
                  
                  {/* Delivery Status Alert */}
                  <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${order.isDelivered ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                     {order.isDelivered ? <CheckCircle className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                     <div>
                       <p className="font-bold">{order.isDelivered ? "Delivered" : "Not Delivered"}</p>
                       {order.isDelivered && <p className="text-xs">at {new Date(order.deliveredAt).toLocaleString()}</p>}
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. PAYMENT INFO */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <CreditCard className="w-5 h-5 text-blue-600" /> Payment Method
              </h2>
              <div className="text-slate-600 space-y-3">
                 <p><span className="font-semibold text-slate-800">Method:</span> {order.paymentMethod}</p>
                 
                 {/* Payment Status Alert */}
                 <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${order.isPaid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                     {order.isPaid ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                     <div>
                       <p className="font-bold">{order.isPaid ? "Paid" : "Not Paid"}</p>
                       {order.isPaid && <p className="text-xs">at {new Date(order.paidAt).toLocaleString()}</p>}
                     </div>
                  </div>
              </div>
            </div>

            {/* 3. ORDER ITEMS */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
               <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Package className="w-5 h-5 text-blue-600" /> Order Items
               </h2>
               <div className="space-y-4">
                 {order.orderItems.length === 0 ? <p>Order is empty</p> : (
                   order.orderItems.map((item, index) => (
                     <div key={index} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                       <div className="flex items-center gap-4">
                         <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg bg-slate-100" />
                         <div>
                           <Link to={`/product/${item.product}`} className="font-medium text-slate-900 hover:text-blue-600">
                             {item.name}
                           </Link>
                           <p className="text-xs text-slate-500">
                             {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                           </p>
                         </div>
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: SUMMARY & ACTIONS --- */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-28">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
                
                <div className="space-y-3 text-sm border-b border-slate-100 pb-6 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Items</span>
                    <span>${order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>${order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>${order.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-slate-900 text-lg">Total</span>
                    <span className="font-black text-blue-600 text-xl">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* --- PAY BUTTON (If not paid) --- */}
                {!order.isPaid && (
                  <div className="space-y-3">
                    <p className="text-xs text-center text-slate-400">Payment Simulation (No real money)</p>
                    <button
                      onClick={successPaymentHandler}
                      disabled={loadingPay}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                      {loadingPay ? <Loader2 className="animate-spin" /> : "Pay Now (Demo)"}
                    </button>
                  </div>
                )}

                {/* --- ADMIN: MARK AS DELIVERED --- */}
                {user && user.isAdmin && order.isPaid && !order.isDelivered && (
                  <button
                    onClick={deliverHandler}
                    disabled={loadingDeliver}
                    className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {loadingDeliver ? <Loader2 className="animate-spin" /> : "Mark As Delivered"}
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