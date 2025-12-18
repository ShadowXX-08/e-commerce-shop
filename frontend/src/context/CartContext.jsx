import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const savedAddress = localStorage.getItem('shippingAddress');
    return savedAddress ? JSON.parse(savedAddress) : {};
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem('paymentMethod') || 'Card';
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem('paymentMethod', paymentMethod);
  }, [paymentMethod]);


  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
  };

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      shippingAddress, 
      paymentMethod,  
      addToCart, 
      removeFromCart, 
      clearCart, 
      saveShippingAddress, 
      savePaymentMethod, 
      getCartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};