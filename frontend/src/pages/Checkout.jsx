import { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  User,
  Loader2,
} from "lucide-react";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // XATOLIK SABABI SHU YERDA EDI (State yo'q edi)
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
  });

  // REDIRECT XATOSINI TUZATISH (useEffect ichiga olindi)
  useEffect(() => {
    // Agar savatcha bo'sh bo'lsa va buyurtma hali berilmagan bo'lsa -> Cartga qaytar
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cartItems, navigate, orderPlaced]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setOrderPlaced(true); // 1. Buyurtma berildi deb belgilaymiz
      clearCart(); // 2. Savatchani tozalaymiz
      setLoading(false);
      toast.success("Product has been added to the cart!");
      navigate("/order-success");
    }, 2000);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* --- LEFT: FORM --- */}
          <div className="md:col-span-2">
            <form
              onSubmit={handlePlaceOrder}
              className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      required
                      name="fullName"
                      placeholder="John Doe"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      required
                      name="address"
                      placeholder="123 Main St, Apartment 4B"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      City
                    </label>
                    <input
                      required
                      name="city"
                      placeholder="Tashkent"
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        required
                        name="phone"
                        type="tel"
                        placeholder="+998 90 123 45 67"
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment (Demo)
                </h2>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm">
                  For this MVP project, payment is simulated. No real money will
                  be charged.
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Place Order"}
              </button>
            </form>
          </div>

          {/* --- RIGHT: SUMMARY --- */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-32">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-slate-600 truncate max-w-[150px]">
                      {item.name} (x{item.qty})
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-blue-600">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
