import { useEffect, useState, useContext } from "react";
import { apiService } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit3, Trash2, 
  Package, Loader2, Image as ImageIcon,
  ExternalLink, AlertCircle
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
      toast.error("Access denied. Admins only.");
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await apiService.getProducts();
      setProducts(data.products || data);
    } catch (e) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      const toastId = toast.loading("Deleting product...");
      try {
        await apiService.deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
        toast.success("Product removed", { id: toastId });
      } catch (err) {
        toast.error("Error deleting product", { id: toastId });
      }
    }
  };

  const createProductHandler = async () => {
    const toastId = toast.loading("Creating sample product...");
    try {
      const { data } = await apiService.createProduct();
      toast.success("Sample created! Redirecting to edit...", { id: toastId });
      navigate(`/admin/product/${data._id}/edit`);
    } catch (err) {
      toast.error("Creation failed", { id: toastId });
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* --- DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Inventory Management</h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
              Review and update your store's stock
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {products.length} Total
              </span>
            </p>
          </div>
          
          <button
            onClick={createProductHandler}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create New Product
          </button>
        </div>

        {/* --- CONTROLS SECTION --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by product name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
               <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
               <p className="text-slate-400 font-bold animate-pulse">Syncing Inventory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Product Info</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">In Stock</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Category</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center opacity-30">
                            <Package className="w-16 h-16 mb-4" />
                            <p className="text-xl font-bold">No products found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <motion.tr 
                          key={product._id} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          {/* 1. Name & Image */}
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-16 shrink-0 rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden">
                                <img 
                                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                  src={product.image || "https://placehold.co/100"} 
                                  alt="" 
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-base font-bold text-slate-900 truncate max-w-[200px]">{product.name}</div>
                                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1 uppercase tracking-tighter">
                                   ID: {product._id.substring(18)}...
                                   <ExternalLink className="w-2 h-2" />
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Price */}
                          <td className="px-8 py-5 text-center">
                            <span className="text-lg font-black text-slate-900">
                              ${Number(product.price).toFixed(2)}
                            </span>
                          </td>

                          {/* 3. Stock Status */}
                          <td className="px-8 py-5 text-center">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${product.countInStock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${product.countInStock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                               {product.countInStock} Units
                            </div>
                          </td>

                          {/* 4. Category */}
                          <td className="px-8 py-5 text-center">
                             <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                               {product.category || "N/A"}
                             </span>
                          </td>

                          {/* 5. Actions */}
                          <td className="px-8 py-5">
                            <div className="flex justify-end gap-3">
                              <Link
                                to={`/admin/product/${product._id}/edit`}
                                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                title="Edit Product"
                              >
                                <Edit3 className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => deleteHandler(product._id)}
                                className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                title="Delete Product"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Demo Alert */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4" />
          Note: Deleting a product will also remove it from all users' carts.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;