import React, { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom"
import { getProducts } from './services/api';

import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

import "./styles/main.css";
import "./styles/checkout.css";
import "./styles/cart.css";

const App = () => {
  console.log('App component re-rendered');
  
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError('');
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    console.log('Adding to cart:', product);
    
    setCart((prevCart) => {
      // Create a complete cart item with all necessary fields
      const cartItem = {
        id: product._id,
        product: product._id,
        _id: product._id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        description: product.description,
        image: product.image,
        stock: product.stock,
        qty: 1,
      };

      const existing = prevCart.find((item) => item.id === product._id);

      if (existing) {
        console.log('Item already exists, increasing qty');
        return prevCart.map((item) =>
          item.id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      } else {
        console.log('Adding new item to cart:', cartItem);
        return [...prevCart, cartItem];
      }
    });
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    console.log('🗑️ Clearing cart after order confirmation');
    setCart([]);
    localStorage.removeItem('cart');
  };

  if (loading) {
    return <div className="container"><p>Loading products...</p></div>;
  }

  return (
    <>
      <Navbar cartCount={cart.length} />

      {error && <div className="error-banner">{error}</div>}

      <Routes>
        <Route
          path="/"
          element={
            <ProductList 
             products={products}
             addToCart={addToCart} 
             loading={loading}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              removeItem={removeItem}
            />
          }
        />

        <Route
          path="/checkout"
          element={<Checkout cartItems={cart} />}
        />

        <Route
          path="/order-success/:orderId"
          element={<OrderSuccess onOrderConfirmed={clearCart} />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;