import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import InputField from '../components/InputField';
import toast from 'react-hot-toast';

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await apiService.getProductById(id);
      setName(data.name);
      setPrice(data.price);
      setImage(data.image);
      setDescription(data.description);
    };
    fetchProduct();
  }, [id]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await apiService.uploadImage(formData);
      // Construct full URL if local
      const imageUrl = import.meta.env.VITE_API_URL.replace('/api', '') + data.image;
      setImage(imageUrl);
      toast.success('Image Uploaded!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateProduct(id, { name, price, image, description });
      toast.success('Product Updated');
      navigate('/admin');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow space-y-4">
        <InputField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <InputField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="flex gap-4 items-center">
                <input type="text" value={image} readOnly className="flex-1 px-4 py-2 border rounded bg-gray-50" />
                <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                    Upload
                    <input type="file" className="hidden" onChange={uploadFileHandler} />
                </label>
            </div>
            {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
        </div>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows="4" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default ProductEditScreen;