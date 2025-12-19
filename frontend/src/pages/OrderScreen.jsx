import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { apiService } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
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
  ArrowLeft,
} from "lucide-react";

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
        setLoading(true);
        const { data } = await apiService.getOrderById(id);
        setOrder(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const successPaymentHandler = async () => {
    setLoadingPay(true);
    try {
      const paymentResult = {
        id: `PAY_${Date.now()}`,
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address: order?.user?.email,
      };
      const { data } = await apiService.payOrder(id, paymentResult);
      setOrder(data);
      toast.success("Payment Successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoadingPay(false);
    }
  };

  const deliverHandler = async () => {
    setLoadingDeliver(true);
    try {
      const { data } = await apiService.deliverOrder(id);
      setOrder(data);
      toast.success("Order Delivered!");
    } catch (error) {
      toast.error("Error updating delivery status");
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <XCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/products" className="text-blue-600 hover:underline mt-4">
          Back to Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="p-2.5 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Order{" "}
                <span className="text-blue-600 uppercase">
                  #{order._id?.substring(order._id.length - 8)}
                </span>
              </h1>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-tighter">
                Placed: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
              order.isPaid
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            {order.isPaid ? "Payment Confirmed" : "Waiting for Payment"}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* 1. SHIPPING */}
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-600" /> Shipping Details
              </h2>
              <div className="space-y-2 text-slate-600">
                <p className="font-bold text-slate-900">
                  {order.user?.name || "Loading Name..."}
                </p>
                <p className="text-blue-600 font-medium">
                  {order.user?.email || "Loading Email..."}
                </p>
                <p className="text-sm leading-relaxed pt-2">
                  {order.shippingAddress?.address},{" "}
                  {order.shippingAddress?.city}
                  <br />
                  {order.shippingAddress?.postalCode},{" "}
                  {order.shippingAddress?.country}
                </p>
              </div>

              <div
                className={`mt-6 p-4 rounded-2xl flex items-center gap-3 border ${
                  order.isDelivered
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                {order.isDelivered ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Truck className="w-5 h-5" />
                )}
                <span className="text-xs font-black uppercase tracking-widest">
                  {order.isDelivered
                    ? `Delivered on ${new Date(
                        order.deliveredAt
                      ).toLocaleString()}`
                    : "Package in Transit"}
                </span>
              </div>
            </div>

            {/* 2. ORDER ITEMS */}
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-blue-600" /> Purchased Items
              </h2>
              <div className="divide-y divide-slate-50">
                {order.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt=""
                        className="w-16 h-16 object-cover rounded-2xl bg-slate-50 border"
                      />
                      <div>
                        <Link
                          to={`/products/${item.product}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-slate-400 font-medium">
                          {item.qty} x ${item.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">
                      ${(item.qty * item.price)?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-32">
              <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-4">
                Order Summary
              </h3>

              <div className="space-y-4 mb-8 text-slate-400 font-medium">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="text-white">
                    ${(order.itemsPrice || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white">
                    ${(order.shippingPrice || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span>Tax (15%)</span>
                  <span className="text-white">
                    ${(order.taxPrice || 0).toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-xl font-bold text-white">
                    Grand Total
                  </span>
                  <span className="text-3xl font-black text-blue-400">
                    ${(order.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* PAY BUTTON */}
              {!order.isPaid && (
                <button
                  onClick={successPaymentHandler}
                  disabled={loadingPay}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
                >
                  {loadingPay ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "PAY ORDER NOW"
                  )}
                </button>
              )}

              {/* ADMIN DELIVER BUTTON */}
              {user?.isAdmin && order.isPaid && !order.isDelivered && (
                <button
                  onClick={deliverHandler}
                  disabled={loadingDeliver}
                  className="w-full mt-4 bg-white/10 border border-white/20 text-white py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all"
                >
                  {loadingDeliver ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "MARK AS DELIVERED"
                  )}
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
