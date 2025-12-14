import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, PackageX, Loader2 } from 'lucide-react';

const Products = () => {
  // 1. ASL NUSXA (Bunga hech qachon filter ishlatib setAllProducts demang!)
  const [allProducts, setAllProducts] = useState([]);
  
  // 2. Loading holati
  const [loading, setLoading] = useState(true);
  
  // 3. Qidiruv so'zi
  const [searchTerm, setSearchTerm] = useState('');

  // --- MA'LUMOT OLISH ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await apiService.getProducts();
        // Backenddan kelgan ma'lumotni 'allProducts'ga saqlaymiz
        setAllProducts(data.products || data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- FILTER MANTIG'I ---
  // Bu yerda 'allProducts' asosida yangi ro'yxat yasaymiz. 
  // 'allProducts' o'zgarmaydi, shuning uchun o'chirganda ma'lumot joyiga qaytadi.
  const displayedProducts = allProducts.filter((product) => {
    if (!searchTerm) return true; // Input bo'sh bo'lsa, hammasini qaytar
    return product.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Animatsiya variantlari
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
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              New Arrivals
            </h2>
            <p className="text-slate-500 mt-2">
              Discover the latest trends in our collection
            </p>
          </div>

          {/* Search & Filter UI */}
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                // Input o'zgarganda faqat searchTerm o'zgaradi
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              />
              {/* O'chirish (X) tugmasi - qulaylik uchun */}
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <PackageX className="w-4 h-4" />
                </button>
              )}
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Filter</span>
            </button>
          </div>
        </div>

        {/* --- CONTENT --- */}
        {loading ? (
          // Loading Skeleton
          <div className="flex justify-center items-center h-64">
             <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
             {/* Natija yo'q bo'lsa */}
             {displayedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <PackageX className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                  <p className="text-slate-500 max-w-md">
                    We couldn't find any products matching "{searchTerm}".
                  </p>
                </div>
             ) : (
               // Bor bo'lsa - ro'yxatni chiqaramiz
               // AnimatePresence va layout prop - silliq o'zgarish uchun
               <motion.div 
                 layout
                 variants={containerVariants}
                 initial="hidden"
                 animate="visible"
                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
               >
                 <AnimatePresence>
                   {displayedProducts.map((product) => (
                     <motion.div 
                       layout
                       key={product._id} 
                       variants={itemVariants}
                       initial="hidden" 
                       animate="visible" 
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