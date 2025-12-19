const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
})); 

app.use(compression()); 

const allowedOrigins = [
  "https://e-commerce-shop-frontend-nine.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS siyosati bo\'yicha ruxsat berilmadi'));
    }
  },
  credentials: true,
  methods: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  allowedHeaders: "Content-Type, Authorization, X-Requested-With"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.get("/", (req, res) => {
  res.send("D-Shop API is running...");
});

app.use((req, res, next) => {
  const error = new Error(`Topilmadi - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server ${process.env.NODE_ENV} rejimida ${PORT}-portda ishga tushdi`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Xatolik: ${err.message}`);
  server.close(() => process.exit(1));
});