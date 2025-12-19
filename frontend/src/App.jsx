import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Komponentlar
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Sahifalar
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import PlaceOrder from './pages/PlaceOrder';
import OrderScreen from "./pages/OrderScreen";
import OrderSuccess from "./pages/OrderSuccess";

// Admin Sahifalar
import AdminDashboard from "./pages/AdminDashboard";
import ProductEditScreen from "./pages/ProductEditScreen";

// Route Himoyachilari
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          duration: 3000,
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
          }
        }} 
      />

      <Navbar />

      <main className="grow">
        <Routes>
          {/* --- OCHIQ ROUTELAR (Hamma ko'ra oladi) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- HIMOYALANGAN ROUTELAR (Faqat Login qilganlar uchun) --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/success" element={<OrderSuccess />} />
          </Route>

          {/* --- ADMIN ROUTELAR (Faqat Adminlar uchun) --- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/admin/product/:id/edit"
              element={<ProductEditScreen />}
            />
          </Route>

          {/* 404 Sahifa (Topilmaganda Home'ga qaytaradi) */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;