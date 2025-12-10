const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      isAdmin: true,
    });
    await admin.save();

    const user = new User({
      name: 'John Doe',
      email: 'user@example.com',
      password: '123456',
      isAdmin: false,
    });
    await user.save(); 

    const sampleProducts = [
      {
        name: 'Airpods Wireless Bluetooth Headphones',
        image: '/uploads/airpods.jpg', 
        description: 'Bluetooth technology lets you connect it with compatible devices wirelessly',
        price: 89.99,
        countInStock: 3,
        user: admin._id,
      },
      {
        name: 'iPhone 13 Pro 256GB Memory',
        image: '/uploads/phone.jpg',
        description: 'Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity.',
        price: 599.99,
        countInStock: 10,
        user: admin._id,
      },
    ];

    await Product.insertMany(sampleProducts);

    console.log('✅ Data Imported & Passwords Encrypted!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();