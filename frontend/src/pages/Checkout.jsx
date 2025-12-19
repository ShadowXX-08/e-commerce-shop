import { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  ChevronRight,
  Globe,
  Box,
  Bookmark
} from "lucide-react";
import InputField from "../components/InputField";

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
    
    const cleanedData = {
      fullName: formData.fullName.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      postalCode: formData.postalCode.trim(),
      country: formData.country.trim(),
      phone: formData.phone.trim(),
    };

    saveShippingAddress(cleanedData);
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
          <Link to="/cart" className="hover:text-blue-600 transition-colors">01 Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900">02 Shipping</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-300">03 Place Order</span>
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Shipping Details</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT: FORM SECTION */}
          <div className="lg:col-span-2">
            <form
              onSubmit={submitHandler}
              className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 space-y-2"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                Where should we send it?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <InputField
                    label="Recipient Name"
                    name="fullName"
                    icon={User}
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <InputField
                    label="Street Address"
                    name="address"
                    icon={MapPin}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, Apartment 4B"
                    required
                  />
                </div>

                {/* City */}
                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Tashkent"
                  required
                />

                {/* Phone */}
                <InputField
                  label="Contact Number"
                  name="phone"
                  type="tel"
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+998"
                  required
                />

                {/* Postal Code */}
                <InputField
                  label="Zip / Postal Code"
                  name="postalCode"
                  icon={Bookmark}
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="100000"
                  required
                />

                {/* Country */}
                <InputField
                  label="Country"
                  name="country"
                  icon={Globe}
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Uzbekistan"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mt-6 active:scale-95"
              >
                Review Order <ChevronRight className="w-6 h-6" />
              </button>
            </form>
          </div>

          {/* RIGHT: ORDER PREVIEW */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 sticky top-32">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Box className="w-5 h-5 text-slate-400" /> Summary
              </h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <img 
                         src={item.image} 
                         alt="" 
                         className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-50 shrink-0" 
                       />
                       <div className="flex flex-col min-w-0">
                         <span className="text-sm font-bold text-slate-800 truncate">
                           {item.name}
                         </span>
                         <span className="text-xs text-slate-400 font-medium">Qty: {item.qty}</span>
                       </div>
                    </div>
                    <span className="font-black text-slate-900 ml-2">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-50 pt-6 space-y-3">
                <div className="flex justify-between items-center text-slate-400 font-medium text-sm">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-slate-900">Total Due</span>
                  <span className="text-3xl font-black text-blue-600">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-6 text-center bg-slate-50 py-3 rounded-2xl font-medium">
                Shipping & taxes calculated at review
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;