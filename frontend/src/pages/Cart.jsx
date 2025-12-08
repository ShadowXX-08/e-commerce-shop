import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      alert("Checkout Logic: API Service createOrder would run here.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/products" className="text-blue-600 hover:underline">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item._id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
              <img src={item.image || "https://placehold.co/100"} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="grow">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-500">${item.price}</p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-sm">Qty: {item.qty}</span>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              </div>
              <div className="font-bold text-lg">${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}
          <button onClick={clearCart} className="text-red-500 text-sm mt-4 hover:underline">Clear Cart</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm h-fit border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 font-bold text-lg border-t pt-4">
            <span>Total</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;