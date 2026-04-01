import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Checkout = ({ cartItems = [] }) => {
  const navigate = useNavigate();
  const [localCart, setLocalCart] = useState([]);
  
  const [formData, setFormData] = useState({
    shippingAddress: '',
    customerEmail: '',
    customerPhone: '',
    gstinBuyer: '',
    paymentMethod: 'cod', // Cash on Delivery
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);

  // Check authentication and load cart
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('⚠️ Please login first to proceed with checkout');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    console.log('✅ User is logged in');

    let cart = [];
    
    if (cartItems && cartItems.length > 0) {
      cart = cartItems;
      console.log('✅ Cart from props:', JSON.stringify(cartItems, null, 2));
    } else {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          cart = JSON.parse(savedCart);
          console.log('✅ Cart from localStorage:', JSON.stringify(cart, null, 2));
        } catch (e) {
          console.error('❌ Error parsing saved cart:', e);
          setError('Failed to load cart. Please go back and try again.');
          cart = [];
        }
      }
    }
    
    if (cart.length === 0) {
      setError('Your cart is empty. Please add items first.');
    }
    
    setLocalCart(cart);
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate subtotal and GST with robust validation
  const subtotal = localCart.reduce((sum, item) => {
    const price = item && item.price ? parseFloat(item.price) : 0;
    const qty = item && (item.qty || item.quantity) ? parseInt(item.qty || item.quantity) : 0;
    
    if (price <= 0 || qty <= 0) {
      console.warn(`⚠️ Invalid item data:`, item);
      return sum;
    }
    
    const itemTotal = price * qty;
    console.log(`📦 ${item.name}: ₹${price} × ${qty} = ₹${itemTotal.toFixed(2)}`);
    return sum + itemTotal;
  }, 0);
  
  const gstRate = 18;
  const gstAmount = Math.round((subtotal * gstRate) / 100 * 100) / 100;
  const totalAmount = subtotal + gstAmount;

  console.log('═══════════════════════════');
  console.log('💰 CHECKOUT SUMMARY:');
  console.log(`Subtotal: ₹${subtotal.toFixed(2)}`);
  console.log(`GST (18%): ₹${gstAmount.toFixed(2)}`);
  console.log(`Total: ₹${totalAmount.toFixed(2)}`);
  console.log('═══════════════════════════');

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form data
      if (!formData.shippingAddress.trim()) {
        setError('❌ Please enter your delivery address');
        setLoading(false);
        return;
      }

      if (!formData.customerEmail.trim()) {
        setError('❌ Please enter your email address');
        setLoading(false);
        return;
      }

      if (!formData.customerPhone.trim()) {
        setError('❌ Please enter your phone number');
        setLoading(false);
        return;
      }

      // Create COD (Cash on Delivery) order
      console.log('📤 Creating COD order...');
      const response = await api.post('/payment/create-order', {
        items: localCart.map(item => ({
          product: item._id || item.product || item.id,
          quantity: item.quantity || item.qty
        })),
        shippingAddress: formData.shippingAddress,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        gstinBuyer: formData.gstinBuyer,
        paymentMethod: 'cod'
      });

      console.log('✅ Order created successfully:', response.data);
      const { orderId } = response.data;

      // Clear cart and navigate to success page
      console.log('✅ Clearing cart and redirecting to order success page...');
      localStorage.removeItem('cart');
      navigate(`/order-success/${orderId}`);

    } catch (err) {
      console.error('❌ Error creating order:', err);
      const errorMsg = err.response?.data?.message 
        || err.message 
        || 'Failed to create order. Please try again.';
      setError(`❌ ${errorMsg}`);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <h1>Checkout</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            {localCart.length === 0 && (
              <div style={{ color: '#e74c3c', padding: '10px', background: '#fadbd8', borderRadius: '4px', marginBottom: '10px' }}>
                ⚠️ No items in cart! Please go back and add products.
              </div>
            )}
            <div className="summary-items">
              {localCart.map((item) => {
                const itemPrice = item && item.price ? parseFloat(item.price) : 0;
                const itemQty = item && (item.qty || item.quantity) ? parseInt(item.qty || item.quantity) : 0;
                const itemSubtotal = itemPrice * itemQty;
                
                return (
                  <div key={item._id || item.product || item.id} className="summary-item">
                    <div>
                      <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                      <br />
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        ₹{itemPrice.toFixed(2)} × {itemQty} = ₹{itemSubtotal.toFixed(2)}
                      </span>
                    </div>
                    <span style={{ fontWeight: '600', color: '#FF6B6B' }}>₹{itemSubtotal.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="summary-breakdown">
              <div className="breakdown-row">
                <span>Subtotal:</span>
                <span className="amount">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="breakdown-row highlight">
                <span>GST (18%):</span>
                <span className="amount">₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="breakdown-row total">
                <span>Total Amount:</span>
                <span className="amount">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleCreateOrder} className="checkout-form">
            <div className="form-section">
              <h3>Delivery Address</h3>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                placeholder="Enter your complete address"
                required
                rows="4"
              />
            </div>

            <div className="form-section">
              <h3>Contact Information</h3>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="Email address"
                required
              />
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="Phone number"
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div className="form-section">
              <h3>Tax Information (Optional)</h3>
              <input
                type="text"
                name="gstinBuyer"
                value={formData.gstinBuyer}
                onChange={handleInputChange}
                placeholder="GSTIN (if registered)"
                pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
              />
              <small>Format: 27AABCT1234H1Z0</small>
            </div>

            <button
              type="submit"
              disabled={loading || localCart.length === 0}
              className="pay-button"
            >
              {loading ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Tax Compliance Note */}
        <div className="tax-info">
          <h4>Tax & Compliance</h4>
          <ul>
            <li>GST (18%) will be added to your order</li>
            <li>Tax invoice will be provided after payment</li>
            <li>GST is applicable to all electronics in India</li>
            <li>For B2B purchases, provide valid GSTIN</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
