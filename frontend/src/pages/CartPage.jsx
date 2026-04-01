import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCartAPI } from '../services/api';
import '../styles/cart.css';

const CartPage = ({ cart, increaseQty, decreaseQty, removeItem }) => {
  const [error, setError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  // Calculate totals with GST - FIXED CALCULATION
  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity || item.qty || 0) || 0;
    const itemTotal = price * qty;
    console.log(`CartPage: ${item.name} = ₹${price} × ${qty} = ₹${itemTotal}`);
    return sum + itemTotal;
  }, 0);
  
  console.log('CartPage Subtotal: ₹' + subtotal.toFixed(2));
  
  const gstRate = 18;
  const gstAmount = Math.round((subtotal * gstRate) / 100 * 100) / 100;
  const total = subtotal + gstAmount;

  if (cart.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Add items to your cart to proceed</p>
        <Link to="/" className="back-link">← Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      
      {error && <div className="error-alert">{error}</div>}
      
      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items-section">
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.product || item.id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <p className="item-price">₹{item.price}</p>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => decreaseQty(item.product || item.id)}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity || item.qty}</span>
                  <button 
                    onClick={() => increaseQty(item.product || item.id)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                
                <p className="item-total">
                  ₹{((item.price * (item.quantity || item.qty)).toFixed(2))}
                </p>
                
                <button 
                  className="remove-btn"
                  onClick={() => removeItem(item.product || item.id)}
                  title="Remove from cart"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary & Checkout */}
        <div className="cart-summary-section">
          <div className="summary-card">
            <h2>Order Summary</h2>
            
            <div className="summary-breakdown">
              <div className="breakdown-item">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="breakdown-item gst-breakdown">
                <span>GST ({gstRate}%):</span>
                <span className="gst-amount">₹{gstAmount.toFixed(2)}</span>
              </div>
              
              <div className="breakdown-item total-item">
                <span>Total Amount:</span>
                <span className="total-amount">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="tax-notice">
              <strong>ℹ️ Tax Information</strong>
              <p>18% GST is included in the total amount as per Indian tax law</p>
            </div>

            <Link 
              to="/checkout"
              state={{ cartItems: cart, subtotal, gstAmount, total }}
              className="proceed-btn"
            >
              Proceed to Checkout
            </Link>

            <Link 
              to="/products"
              className="continue-shopping-btn"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;