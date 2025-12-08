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

    const createdUsers = await User.insertMany([
      { name: 'Admin User', email: 'admin@example.com', password: '123456', isAdmin: true },
      { name: 'John Doe', email: 'user@example.com', password: '123456', isAdmin: false },
    ]);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = [
      { name: 'Airpods', image: 'https://placehold.co/400', description: 'Bluetooth tech', price: 89.99, countInStock: 3, user: adminUser },
      { name: 'iPhone 13', image: 'https://placehold.co/400', description: 'Mobile phone', price: 599.99, countInStock: 10, user: adminUser },
    ];

    await Product.insertMany(sampleProducts);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();