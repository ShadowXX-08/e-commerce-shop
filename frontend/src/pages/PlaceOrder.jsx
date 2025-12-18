import { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
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
  const taxPrice = Number((itemsPrice * 0.15).toFixed(2)); 
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

  // --- TEKSHIRUV ---
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/checkout');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [navigate, shippingAddress, cartItems]);

  // --- BUYURTMA BERISH ---
  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: Number(itemsPrice),
        shippingPrice: Number(shippingPrice),
        taxPrice: Number(taxPrice),
        totalPrice: Number(totalPrice),
      };

      const { data } = await apiService.createOrder(orderData);
      
      clearCart(); 
      toast.success('Order placed successfully!');
      navigate(`/order/${data._id}`);
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb / Header */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
          <Link to="/cart" className="hover:text-blue-600">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/checkout" className="hover:text-blue-600">Shipping</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">Place Order</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-8">Review & Place Order</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* --- LEFT SIDE: INFO --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. SHIPPING INFO */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" /> Shipping Address
              </h2>
              <div className="text-slate-600 ml-7 space-y-1">
                <p className="font-medium text-slate-900">{shippingAddress.fullName}</p>
                <p>{shippingAddress.address}, {shippingAddress.city}</p>
                <p>Phone: {shippingAddress.phone}</p>
              </div>
            </div>

            {/* 2. PAYMENT METHOD */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" /> Payment Method
              </h2>
              <div className="text-slate-600 ml-7">
                Method: <span className="font-bold text-slate-900">{paymentMethod}</span>
              </div>
            </div>

            {/* 3. ORDER ITEMS */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" /> Order Items
              </h2>
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center p-4 bg-slate-50 rounded-xl text-slate-500">
                    Your cart is empty
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                        />
                        <div>
                          <Link to={`/product/${item._id}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block">
                            {item.name}
                          </Link>
                          <p className="text-slate-500 text-sm">
                            {item.qty} x ${item.price} = <span className="font-bold text-slate-900">${(item.qty * item.price).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* --- RIGHT SIDE: SUMMARY --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3 text-sm border-b border-slate-100 pb-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Items Price</span>
                  <span className="font-semibold">${addDecimals(itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingPrice === 0 ? <span className="text-green-600">Free</span> : `$${shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax (15%)</span>
                  <span className="font-semibold">${taxPrice}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-blue-600">${totalPrice}</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-start gap-2">
                 <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                 <p className="text-xs text-amber-800 font-medium">
                   This is a demo store. No real payments will be processed.
                 </p>
              </div>

              <button
                type="button"
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-600 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0 || loading}
                onClick={placeOrderHandler}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Place Order"}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;