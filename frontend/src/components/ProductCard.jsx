import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Star, Heart, Eye, Plus } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  // Reytingni hisoblash uchun yordamchi funksiya (agar back-endda rating bo'lsa)
  const renderStars = (rating = 4.5) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
      />
    ));
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col overflow-hidden h-full">
      
      {/* --- IMAGE SECTION --- */}
      <div className="relative aspect-4/5 overflow-hidden bg-slate-50">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image || "https://placehold.co/400x500?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges (New / Sale) */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
           {product.isNew && (
            <span className="bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase shadow-lg">
              New
            </span>
          )}
          {/* Agar chegirma bo'lsa (misol uchun) */}
          {/* <span className="bg-rose-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">-20%</span> */}
        </div>

        {/* Floating Actions (Hoverda chiqadigan tugmalar) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <button className="p-2.5 bg-white text-slate-600 rounded-full shadow-lg hover:bg-rose-50 hover:text-rose-500 transition-colors tooltip" title="Add to Wishlist">
            <Heart className="w-5 h-5" />
          </button>
          <Link to={`/product/${product._id}`} className="p-2.5 bg-white text-slate-600 rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-colors" title="Quick View">
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col grow">
        
        {/* Category (Optional) */}
        <div className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
           {product.category || "Fashion"}
        </div>

        {/* Title */}
        <Link to={`/product/${product._id}`} className="block mb-2">
          <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5">
             {renderStars(product.rating || 4.5)} 
          </div>
          <span className="text-xs text-slate-400 ml-1">({product.numReviews || 12})</span>
        </div>

        {/* Description */}
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed grow">
          {product.description}
        </p>

        {/* --- FOOTER (Price & Button) --- */}
        <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between gap-3">
          
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Price</span>
            <span className="text-xl font-extrabold text-slate-900">
              ${product.price?.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="group/btn flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 active:scale-95 transition-all duration-300"
          >
            <span className="text-sm">Add</span>
            <div className="w-5 h-5 relative flex items-center justify-center">
               <ShoppingCart className="w-4 h-4 absolute transition-all duration-300 group-hover/btn:-translate-y-5 group-hover/btn:opacity-0" />
               <Plus className="w-4 h-4 absolute translate-y-5 opacity-0 transition-all duration-300 group-hover/btn:translate-y-0 group-hover/btn:opacity-100" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;