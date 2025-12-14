import { useEffect, useState, useContext } from "react";
import { apiService } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, Search, Edit3, Trash2, 
  Package, MoreHorizontal, Loader2, Image as ImageIcon 
} from "lucide-react";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Qidiruv uchun state

  // Backenddan mahsulotlarni yuklash
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await apiService.getProducts();
      setProducts(data.products || data);
    } catch (e) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Brauzerning standart confirm oynasi o'rniga chiroyliroq yechim qilsa bo'ladi, 
    // lekin hozircha standart qoldiramiz:
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await apiService.deleteProduct(id);
        toast.success("Product Deleted Successfully");
        // O'chirilgandan keyin ro'yxatni yangilash
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const handleCreate = async () => {
    const toastId = toast.loading("Creating product...");
    try {
      await apiService.createProduct();
      toast.success("Sample Product Created", { id: toastId });
      fetchProducts(); // Ro'yxatni yangilash
    } catch (err) {
      toast.error("Create failed", { id: toastId });
    }
  };

  // Qidiruv bo'yicha filtrlash
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              Manage your store inventory 
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {products.length} Products
              </span>
            </p>
          </div>
          
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          {loading ? (
            // SKELETON LOADING
            <div className="p-8 space-y-4">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="w-40 h-4 bg-slate-100 rounded"></div>
                        <div className="w-20 h-3 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <div className="w-20 h-8 bg-slate-100 rounded"></div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center">
                          <Package className="w-12 h-12 text-slate-300 mb-2" />
                          <p>No products found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={product._id} 
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Product Info */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                              {product.image ? (
                                <img className="h-full w-full object-cover" src={product.image} alt="" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-300">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-slate-900">{product.name}</div>
                              <div className="text-xs text-slate-500">ID: {product._id.substring(0, 10)}...</div>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ${product.price}
                          </span>
                        </td>

                        {/* Category (Agar backenddan kelsa, bo'lmasa static text) */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {product.category || "General"}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/product/${product._id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;