require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});

    const products = [
      {
        name: "Laptop",
        description: "High-performance laptop for work and gaming",
        price: 899,
        image: "/images/laptop.jpg",  // Local image path
        stock: 50,
        category: "Electronics"
      },
      {
        name: "Headphones",
        description: "Wireless headphones with noise cancellation",
        price: 79,
        image: "/images/headphones.jpg",
        stock: 100,
        category: "Electronics"
      },
      {
        name: "Phone",
        description: "Latest smartphone with 5G",
        price: 699,
        image: "/images/phone.jpg",
        stock: 75,
        category: "Electronics"
      },
      {
        name: "Tablet",
        description: "10-inch tablet perfect for reading",
        price: 399,
        image: "/images/tablet.jpg",
        stock: 60,
        category: "Electronics"
      },
      {
        name: "Smartwatch",
        description: "Fitness tracking smartwatch",
        price: 199,
        image: "/images/smartwatch.jpg",
        stock: 80,
        category: "Electronics"
      },
      {
        name: "Camera",
        description: "4K digital camera with 30x zoom",
        price: 549,
        image: "/images/camera.jpg",
        stock: 40,
        category: "Electronics"
      },
      {
        name: "Speaker",
        description: "Portable Bluetooth speaker",
        price: 59,
        image: "/images/speaker.jpg",
        stock: 120,
        category: "Electronics"
      },
      {
        name: "Monitor",
        description: "27-inch 4K ultra HD monitor",
        price: 299,
        image: "/images/monitor.jpg",
        stock: 35,
        category: "Electronics"
      },
      {
        name: "Keyboard",
        description: "Mechanical RGB keyboard",
        price: 89,
        image: "/images/keyboard.jpg",
        stock: 90,
        category: "Electronics"
      },
      {
        name: "Mouse",
        description: "Wireless ergonomic mouse",
        price: 49,
        image: "/images/mouse.jpg",
        stock: 150,
        category: "Electronics"
      }
    ];

    const result = await Product.insertMany(products);
    console.log(`✅ ${result.length} products added to database`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();