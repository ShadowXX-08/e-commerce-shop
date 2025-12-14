import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, Star, ShoppingCart, Heart, 
  Minus, Plus, Truck, ShieldCheck, RefreshCcw 
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  
  // UI uchun qo'shimcha holatlar (Interfeys chiroyli bo'lishi uchun)
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M'); // O'lcham tanlash (vizual)
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        // Loading effektini ko'rsatish uchun sun'iy kechikish
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity); 
    toast.success("Added to cart!");
  };

  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') setQuantity(quantity + 1);
  };

  // --- SKELETON LOADING (Yuklanayotganda) ---
  if (loading) return (
    <div className="min-h-screen bg-white pt-32 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 w-32 h-6 bg-slate-200 rounded animate-pulse"></div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-slate-200 rounded-[2.5rem] aspect-4/5 animate-pulse"></div>
          <div className="space-y-6">
            <div className="w-3/4 h-12 bg-slate-200 rounded animate-pulse"></div>
            <div className="w-1/4 h-8 bg-slate-200 rounded animate-pulse"></div>
            <div className="w-full h-40 bg-slate-200 rounded animate-pulse"></div>
            <div className="flex gap-4 pt-4">
              <div className="w-1/3 h-14 bg-slate-200 rounded animate-pulse"></div>
              <div className="w-2/3 h-14 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- ERROR STATE ---
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 pt-20">
       <h2 className="text-3xl font-bold mb-4 text-slate-800">Product Not Found</h2>
       <p className="mb-6">We couldn't find the product you're looking for.</p>
       <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
         Back to Shop
       </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation (Breadcrumb style back button) */}
        <motion.button 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate(-1)}
          className="group flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <div className="p-2.5 rounded-full bg-slate-100 group-hover:bg-blue-50 mr-3 transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-semibold">Back to Products</span>
        </motion.button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* --- LEFT SIDE: IMAGE --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group"
          >
            <img 
              src={product.image || "https://placehold.co/600x800?text=No+Image"} 
              alt={product.name} 
              className="w-full h-full object-cover object-center aspect-4/5 hover:scale-105 transition-transform duration-700"
            />
            {/* New Badge */}
            {product.isNew && (
              <span className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-xl border border-white/10">
                New Arrival
              </span>
            )}
          </motion.div>

          {/* --- RIGHT SIDE: INFO --- */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col h-full justify-center"
          >
            {/* Category & Rating */}
            <div className="flex justify-between items-start mb-6">
              <span className="text-blue-600 font-bold tracking-wide uppercase text-xs bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                {product.category || "Fashion Store"}
              </span>
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-slate-800 font-bold text-sm">4.8</span>
                <span className="text-slate-400 text-xs border-l border-amber-200 pl-1.5 ml-0.5">(120 Reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-4xl font-bold text-slate-900 mb-8 flex items-baseline gap-3">
              ${product.price?.toLocaleString()}
              <span className="text-xl text-slate-400 font-medium line-through decoration-red-400/50 decoration-2">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-lg leading-relaxed mb-8 border-b border-slate-100 pb-8">
              {product.description || "Experience premium quality with our latest collection. Designed for comfort and style, this product is crafted from fine materials to ensure durability and elegance."}
            </p>

            {/* Sizes (MOCK UI - Vizual ko'rinish uchun) */}
            <div className="mb-8">
              <span className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Select Size</span>
              <div className="flex flex-wrap gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all duration-200 ${
                      selectedSize === size 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30 scale-110' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Area */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {/* Quantity Selector */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1.5 w-max border border-slate-200">
                <button 
                  onClick={() => handleQuantity('dec')} 
                  disabled={quantity <= 1}
                  className="p-3 bg-white rounded-lg shadow-sm hover:text-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-14 text-center font-bold text-lg text-slate-800">{quantity}</span>
                <button 
                  onClick={() => handleQuantity('inc')} 
                  className="p-3 bg-white rounded-lg shadow-sm hover:text-blue-600 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              {/* Wishlist Button */}
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  isWishlisted 
                    ? 'border-rose-200 bg-rose-50 text-rose-500 scale-105' 
                    : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-slate-100">
              <div className="flex flex-col items-center text-center gap-2 group">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 group">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 group">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <RefreshCcw className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">30 Days Return</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;