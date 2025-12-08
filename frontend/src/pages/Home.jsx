import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to D-SHOP</h1>
          <p className="text-xl mb-8 text-blue-100">The best products at the best prices. Delivered fast.</p>
          <Link to="/products" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-lg">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Shop With Us?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Get your products in 2-3 business days.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your data is always protected.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">We are here to help anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;