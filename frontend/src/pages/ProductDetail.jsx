import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link to="/products" className="text-gray-500 hover:text-blue-600 mb-6 inline-block">← Back to Products</Link>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <img src={product.image || "https://placehold.co/600x600"} alt={product.name} className="w-full h-auto rounded-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-2xl text-blue-600 font-bold mb-6">${product.price}</p>
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
          
          <button 
            onClick={() => addToCart(product)}
            className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;