import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiService = {
  // --- AUTH (Foydalanuvchi) ---
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getUserProfile: () => api.get("/auth/profile"),
  updateUserProfile: (data) => api.put("/auth/profile", data),

  // --- PRODUCTS (Mahsulotlar) ---
  getProducts: (params) => api.get("/products", { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Mahsulotga izoh (Review) qoldirish
  createProductReview: (id, review) => api.post(`/products/${id}/reviews`, review),

  // --- ORDERS (Buyurtmalar) ---
  createOrder: (orderData) => api.post("/orders", orderData),
  getMyOrders: () => api.get("/orders/myorders"),
  getOrderById: (id) => api.get(`/orders/${id}`),
  
  // To'lov qilinganini tasdiqlash
  payOrder: (id, paymentResult) => api.put(`/orders/${id}/pay`, paymentResult),
  
  // Admin: Yetkazib berilganini tasdiqlash
  deliverOrder: (id) => api.put(`/orders/${id}/deliver`, {}),
  
  // Admin: Barcha buyurtmalar ro'yxati
  getOrders: () => api.get("/orders"),

  // --- UPLOAD (Rasm yuklash) ---
  uploadImage: (formData) =>
    api.post("/upload", formData),
};

export default api;