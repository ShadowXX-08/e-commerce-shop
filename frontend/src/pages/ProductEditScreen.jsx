import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, UploadCloud, Save, Loader2, 
  Type, DollarSign, FileText, Image as ImageIcon,
  Tag, Layers, Box
} from 'lucide-react';
import InputField from '../components/InputField';

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiService.getProductById(id);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand || '');
        setCategory(data.category || '');
        setCountInStock(data.countInStock || 0);
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
      setImage(data.image);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateProduct(id, { 
        name, 
        price: Number(price), 
        image, 
        brand, 
        category, 
        countInStock: Number(countInStock), 
        description 
      });
      toast.success('Product updated successfully');
      navigate('/admin'); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  if (pageLoading) return (
    <div className="min-h-screen flex items-center justify-center pt-28">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Product</h1>
            <p className="text-slate-500 text-sm font-medium">Update inventory details and media</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: IMAGE PREVIEW & UPLOAD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" /> Media Assets
              </h3>
              <div className="relative group aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-blue-400 transition-all">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    <span className="text-xs font-bold text-slate-400">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <img src={image || "https://placehold.co/400"} className="w-full h-full object-cover" alt="Product" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                      <div className="flex flex-col items-center text-white">
                        <UploadCloud className="w-8 h-8 mb-2" />
                        <span className="font-bold text-sm">Change Image</span>
                      </div>
                    </div>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={uploadFileHandler} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  disabled={uploading} 
                />
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
                Recommended size: 1000x1000px
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM DETAILS */}
          <div className="lg:col-span-2">
            <form onSubmit={submitHandler} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-2">
              
              <div className="grid md:grid-cols-2 gap-x-6">
                {/* Name */}
                <div className="md:col-span-2">
                  <InputField
                    label="Product Title"
                    icon={Type}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Premium Wireless Headphones"
                    required
                  />
                </div>

                {/* Brand */}
                <InputField
                  label="Brand Name"
                  icon={Tag}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Sony, Apple, Nike"
                  required
                />

                {/* Category */}
                <InputField
                  label="Category"
                  icon={Layers}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Electronics, Fashion"
                  required
                />

                {/* Price */}
                <InputField
                  label="Unit Price ($)"
                  type="number"
                  icon={DollarSign}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />

                {/* Stock */}
                <InputField
                  label="Quantity in Stock"
                  type="number"
                  icon={Box}
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-1.5 mb-6">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" /> Description
                </label>
                <textarea 
                  rows="5" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 font-medium resize-none leading-relaxed"
                  placeholder="Tell customers about this product..."
                  required
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => navigate(-1)} 
                  className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit" 
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
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