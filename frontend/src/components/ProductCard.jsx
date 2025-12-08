import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.image || "https://placehold.co/400x300"} 
          alt={product.name} 
          className="w-full h-48 object-cover hover:scale-105 transition duration-500"
        />
      </Link>
      <div className="p-4 flex flex-col grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">${product.price}</span>
          <button 
            onClick={() => addToCart(product)}
            className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;