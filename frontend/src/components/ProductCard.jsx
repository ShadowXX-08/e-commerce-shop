import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Star, Heart, Eye, Plus, PackageX } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const renderStars = (rating = 0) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
      />
    ));
  };

  const handleAddClick = (e) => {
    e.preventDefault(); 
    if (product.countInStock > 0) {
      addToCart(product);
      toast.success("Added to cart!");
    } else {
      toast.error("Out of stock");
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col overflow-hidden h-full">
      
      {/* --- IMAGE SECTION --- */}
      <div className="relative aspect-4/5 overflow-hidden bg-slate-50">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.image || "https://placehold.co/400x500?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges (New / Out of Stock) */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.countInStock === 0 ? (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow-lg">
              Sold Out
            </span>
          ) : (
            product.numReviews > 5 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow-lg">
                Popular
              </span>
            )
          )}
        </div>

        {/* Floating Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <button className="p-2.5 bg-white text-slate-600 rounded-full shadow-lg hover:bg-rose-50 hover:text-rose-500 transition-colors" title="Add to Wishlist">
            <Heart className="w-5 h-5" />
          </button>
          <Link to={`/products/${product._id}`} className="p-2.5 bg-white text-slate-600 rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-colors" title="Quick View">
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col grow">
        
        <div className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
           {product.category}
        </div>

        <Link to={`/products/${product._id}`} className="block mb-2">
          <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5">
             {renderStars(product.rating)} 
          </div>
          <span className="text-xs text-slate-400 ml-1">({product.numReviews})</span>
        </div>

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
            onClick={handleAddClick}
            disabled={product.countInStock === 0}
            className={`group/btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-lg transition-all duration-300 active:scale-95 
              ${product.countInStock > 0 
                ? 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
          >
            <span className="text-sm">{product.countInStock > 0 ? 'Add' : 'Empty'}</span>
            <div className="w-5 h-5 relative flex items-center justify-center">
               {product.countInStock > 0 ? (
                 <>
                   <ShoppingCart className="w-4 h-4 absolute transition-all duration-300 group-hover/btn:-translate-y-5 group-hover/btn:opacity-0" />
                   <Plus className="w-4 h-4 absolute translate-y-5 opacity-0 transition-all duration-300 group-hover/btn:translate-y-0 group-hover/btn:opacity-100" />
                 </>
               ) : (
                 <PackageX className="w-4 h-4" />
               )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;