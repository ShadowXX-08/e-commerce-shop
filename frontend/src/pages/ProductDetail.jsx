import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, Star, ShoppingCart, 
  Minus, Plus, Truck, ShieldCheck, RefreshCcw, Send
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const [selectedSize, setSelectedSize] = useState('M'); 
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const availableSizes = ['S', 'M', 'L', 'XL', '2XL']; 

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const { data } = await apiService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error(error);
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.countInStock > 0) {
      const productToAdd = { ...product, size: selectedSize };
      
      addToCart(productToAdd, quantity);
      toast.success(`${quantity} x ${product.name} (Size: ${selectedSize}) added!`);
    }
  };

  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') {
      if (quantity < product.countInStock) {
        setQuantity(quantity + 1);
      } else {
        toast.error(`Only ${product.countInStock} items available in stock`);
      }
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await apiService.createProductReview(id, { rating, comment });
      toast.success('Review submitted successfully');
      setComment('');
      fetchProductData(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 w-40 bg-slate-200 rounded-lg"></div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-12 bg-slate-200 rounded-lg w-3/4"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-1/4"></div>
            <div className="h-40 bg-slate-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-500">
       <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
       <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-xl">Back to Shop</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 mb-8 font-semibold transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
          {/* IMAGE SECTION */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-700"
            />
            {product.countInStock === 0 && (
              <span className="absolute top-6 left-6 bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase">Out of Stock</span>
            )}
          </motion.div>

          {/* INFO SECTION */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-full uppercase">{product.category}</span>
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-slate-800 font-bold text-sm">{product.rating?.toFixed(1)}</span>
                <span className="text-slate-400 text-xs pl-1.5 border-l border-amber-200">({product.numReviews} Reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{product.name}</h1>
            
            <div className="text-4xl font-bold mb-6">${product.price?.toLocaleString()}</div>

            <p className="text-slate-600 text-lg leading-relaxed mb-8">{product.description}</p>

            {/* --- NEW: SIZE SELECTOR --- */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-bold text-slate-900">
                        Size: <span className="font-normal text-slate-500">{selectedSize}</span>
                    </span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {availableSizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`
                        h-12 min-w-[3rem] px-4 rounded-xl border font-bold text-sm transition-all duration-200 flex items-center justify-center
                        ${selectedSize === size
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-500 hover:text-blue-600' 
                        }
                        `}
                    >
                        {size}
                    </button>
                    ))}
                </div>
            </div>
            {/* ------------------------- */}

            {/* STOCK STATUS */}
            <div className="mb-8">
              {product.countInStock > 0 ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  In Stock ({product.countInStock} units left)
                </div>
              ) : (
                <div className="text-rose-600 font-bold">Currently Unavailable</div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center bg-slate-100 rounded-xl p-1.5 border border-slate-200">
                <button onClick={() => handleQuantity('dec')} className="p-3 bg-white rounded-lg shadow-sm hover:text-blue-600"><Minus className="w-4 h-4" /></button>
                <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => handleQuantity('inc')} className="p-3 bg-white rounded-lg shadow-sm hover:text-blue-600"><Plus className="w-4 h-4" /></button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="flex-1 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-blue-600 disabled:bg-slate-300 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100">
               <div className="flex flex-col items-center gap-2 text-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <span className="text-[10px] font-bold uppercase">Free Shipping</span>
               </div>
               <div className="flex flex-col items-center gap-2 text-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <span className="text-[10px] font-bold uppercase">Safe Payment</span>
               </div>
               <div className="flex flex-col items-center gap-2 text-center">
                  <RefreshCcw className="w-6 h-6 text-purple-600" />
                  <span className="text-[10px] font-bold uppercase">30 Days Return</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-20 pt-20 border-t border-slate-100">
          <h2 className="text-3xl font-black mb-10">Customer Reviews</h2>
          
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="text-xl font-bold mb-6">Write a Review</h3>
                {isAuthenticated ? (
                  <form onSubmit={submitReviewHandler} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Rating</label>
                      <select 
                        value={rating} 
                        onChange={(e) => setRating(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Comment</label>
                      <textarea 
                        rows="4" 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Share your experience..."
                        required
                      ></textarea>
                    </div>
                    <button 
                      disabled={submittingReview}
                      className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      {submittingReview ? 'Sending...' : <><Send className="w-4 h-4"/> Submit Review</>}
                    </button>
                  </form>
                ) : (
                  <p className="text-slate-500">Please <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link> to write a review.</p>
                )}
              </div>
            </div>

            {/* Review List */}
            <div className="lg:col-span-2 space-y-6">
              {product.reviews.length === 0 && <p className="text-slate-400 italic">No reviews yet. Be the first to review this product!</p>}
              {product.reviews.map((review) => (
                <div key={review._id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-slate-900">{review.name}</div>
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                  <div className="mt-4 text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;