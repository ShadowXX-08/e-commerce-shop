import { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  ChevronRight,
  Globe,
  Mail 
} from "lucide-react";

const Checkout = () => {
  const { cartItems, getCartTotal, shippingAddress, saveShippingAddress } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: shippingAddress.fullName || "",
    address: shippingAddress.address || "",
    city: shippingAddress.city || "",
    postalCode: shippingAddress.postalCode || "",
    country: shippingAddress.country || "Uzbekistan",
    phone: shippingAddress.phone || "",
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    saveShippingAddress(formData);
    
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb (Navigatsiya zanjiri) */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
          <button onClick={() => navigate("/cart")} className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Cart
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">Shipping</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-400">Place Order</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-8">Shipping Address</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* --- CHAP TOMON: FORMA --- */}
          <div className="md:col-span-2">
            <form
              onSubmit={submitHandler}
              className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, Apartment 4B"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* City & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">City</label>
                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Tashkent"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        required
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+998 90 123 45 67"
                        className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Postal Code & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Postal Code</label>
                    <input
                      required
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="100011"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        required
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Uzbekistan"
                        className="w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-600 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4"
              >
                Continue to Payment <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* --- O'NG TOMON: CHEK (PREVIEW) --- */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-32">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Order Preview
              </h3>
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm items-center">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100" />
                       <div className="flex flex-col">
                         <span className="text-slate-700 font-medium truncate max-w-[120px]">
                           {item.name}
                         </span>
                         <span className="text-xs text-slate-400">Qty: {item.qty}</span>
                       </div>
                    </div>
                    <span className="font-bold text-slate-800 whitespace-nowrap">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between items-center text-slate-500 text-sm">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-black text-blue-600">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center bg-slate-50 py-2 rounded-lg">
                Shipping & taxes calculated at next step
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;