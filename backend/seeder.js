const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');
const Order = require('./models/Order');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany(); 
    await Product.deleteMany();
    await User.deleteMany();

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456', 
        isAdmin: true,
      },
      {
        name: 'John Doe',
        email: 'user@example.com',
        password: '123456',
        isAdmin: false,
      },
    ]);
    
    const adminUser = users[0]._id;

    const sampleProducts = [
      {
        name: 'Airpods Wireless Bluetooth Headphones',
        image: 'https://placehold.co/600x400?text=Airpods', 
        description: 'Bluetooth technology lets you connect it with compatible devices wirelessly',
        brand: 'Apple',       
        category: 'Electronics', 
        price: 89.99,
        countInStock: 3,
        rating: 4.5,
        numReviews: 4,
        user: adminUser,
      },
      {
        name: 'iPhone 13 Pro 256GB Memory',
        image: 'https://placehold.co/600x400?text=iPhone+13', 
        description: 'Introducing the iPhone 13 Pro. A transformative triple-camera system.',
        brand: 'Apple',       
        category: 'Electronics', 
        price: 599.99,
        countInStock: 10,
        rating: 4.0,
        numReviews: 4,
        user: adminUser,
      },
      {
        name: 'Sony Playstation 5',
        image: 'https://placehold.co/600x400?text=Playstation+5',
        description: 'The ultimate home entertainment center.',
        brand: 'Sony',
        category: 'Electronics',
        price: 399.99,
        countInStock: 11,
        rating: 5,
        numReviews: 3,
        user: adminUser,
      },
    ];

    await Product.insertMany(sampleProducts);

    console.log('✅ Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();