import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, PackageX, Loader2, X } from 'lucide-react'; 

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await apiService.getProducts();
        setAllProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayedProducts = allProducts.filter((product) => {
    if (!searchTerm) return true;
    return product.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              New Arrivals
            </h2>
            <p className="text-slate-500 mt-2">
              Discover the latest trends in our collection
            </p>
          </motion.div>

          {/* Search & Filter UI */}
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm active:scale-95">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Filter</span>
            </button>
          </div>
        </div>

        {/* --- CONTENT --- */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80">
             <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
             <p className="text-slate-400 animate-pulse">Loading products...</p>
          </div>
        ) : (
          <>
             {displayedProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <PackageX className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                  <p className="text-slate-500 max-w-md mb-6">
                    We couldn't find any products matching <span className="font-bold text-slate-900">"{searchTerm}"</span>.
                  </p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Clear all search
                  </button>
                </motion.div>
             ) : (
               <motion.div 
                 variants={containerVariants}
                 initial="hidden"
                 animate="visible"
                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
               >
                 <AnimatePresence mode="popLayout">
                   {displayedProducts.map((product) => (
                     <motion.div 
                       layout
                       key={product._id} 
                       variants={itemVariants}
                       exit={{ opacity: 0, scale: 0.9 }}
                     >
                        <ProductCard product={product} />
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </motion.div>
             )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;