import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, UploadCloud, Save, Loader2, 
  Type, DollarSign, FileText, Image as ImageIcon 
} from 'lucide-react';

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  
  // Loading holatlari
  const [uploading, setUploading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiService.getProductById(id);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setDescription(data.description);
      } catch (error) {
        toast.error("Error loading product data");
      } finally {
        setPageLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await apiService.uploadImage(formData);
      // Backenddan kelgan yo'lni to'g'irlash (logikani saqlab qoldim)
      const imageUrl = import.meta.env.VITE_API_URL.replace('/api', '') + data.image;
      setImage(imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateProduct(id, { name, price, image, description });
      toast.success('Product updated successfully');
      navigate('/admin'); // Admin dashboardga qaytish
    } catch (error) {
      toast.error('Update failed');
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    // 'pt-28' Navbar balandligini hisobga oladi
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-blue-600 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
            <p className="text-slate-500 text-sm">Update product details and media</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* --- LEFT COLUMN: IMAGE UPLOAD --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                Product Image
              </h3>
              
              <div className="relative group w-full aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden hover:border-blue-400 transition-colors">
                
                {uploading ? (
                  <div className="flex flex-col items-center text-blue-600">
                    <Loader2 className="w-10 h-10 animate-spin mb-2" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                ) : image ? (
                  <>
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" /> Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">Click to upload image</p>
                  </div>
                )}

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </div>
              
              <p className="text-xs text-center text-slate-400 mt-4">
                Supported formats: JPG, PNG, JPEG. <br/> Max size: 5MB.
              </p>
            </div>
          </div>

          {/* --- RIGHT COLUMN: FORM DETAILS --- */}
          <div className="lg:col-span-2">
            <form onSubmit={submitHandler} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
              
              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Product Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                    placeholder="Enter product name" 
                    required 
                  />
                </div>
              </div>

              {/* Price Input */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Price ($)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                    placeholder="0.00" 
                    required 
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
                <div className="relative group">
                  <div className="absolute top-3.5 left-4 pointer-events-none">
                    <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <textarea
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed"
                    placeholder="Describe your product..."
                    required
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Update Product
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductEditScreen;