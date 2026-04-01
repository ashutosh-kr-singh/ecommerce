import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderSuccess = ({ onOrderConfirmed }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/payment/order-details/${orderId}`);
      setOrder(response.data.order);
      // Clear cart after order is successfully placed
      if (onOrderConfirmed) {
        onOrderConfirmed();
        console.log('✅ Cart cleared via callback after successful order');
      }
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      const response = await api.get(`/payment/invoice/${orderId}`);
      const invoice = response.data.invoice;

      // Generate PDF or download invoice
      const invoiceText = generateInvoiceText(invoice);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceText));
      element.setAttribute('download', `Invoice-${invoice.invoiceNumber}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error('Failed to download invoice', err);
    }
  };

  const generateInvoiceText = (invoice) => {
    return `
===============================================
                  TAX INVOICE
===============================================
Invoice Number: ${invoice.invoiceNumber}
Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
Order Date: ${new Date(invoice.orderDate).toLocaleDateString()}

BILL TO:
${invoice.customer.email}
${invoice.customer.phone}
${invoice.customer.address}
${invoice.customer.gstin ? `GSTIN: ${invoice.customer.gstin}` : ''}

===============================================
ITEMS
===============================================
${invoice.items
  .map(
    (item) => `
${item.name}
Qty: ${item.quantity} x ₹${item.price} = ₹${(item.quantity * item.price).toFixed(2)}
`
  )
  .join('')}

===============================================
AMOUNT DETAILS
===============================================
Subtotal:           ₹${invoice.subtotal.toFixed(2)}
GST (${invoice.gstRate}%):       ₹${invoice.gstAmount.toFixed(2)}
───────────────────────────────────
TOTAL AMOUNT:       ₹${invoice.totalAmount.toFixed(2)}

Payment Method: ${invoice.paymentMethod}
${invoice.paymentMethod === 'cod' ? 'Payment Status: To be paid at delivery' : `Payment ID: ${invoice.razorpayPaymentId}`}

Thank you for your purchase!
===============================================
    `;
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-success-container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="order-id">Order ID: {orderId}</p>

        {order && (
          <>
            <div className="order-details">
              <div className="detail-section">
                <h3>Order Summary</h3>
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Amount Breakdown</h3>
                <div className="breakdown">
                  <div className="breakdown-item">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="breakdown-item highlight">
                    <span>GST ({order.gstRate}%):</span>
                    <span>₹{order.gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="breakdown-item total">
                    <span>Total Amount:</span>
                    <span>₹{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Delivery Address</h3>
                <p>{order.shippingAddress}</p>
              </div>

              <div className="detail-section">
                <h3>Payment Information</h3>
                <p>
                  <strong>Status:</strong> <span className="status-paid">{order.status.toUpperCase()}</span>
                </p>
                {order.paymentMethod === 'cod' ? (
                  <>
                    <p>
                      <strong>Payment Method:</strong> <span className="payment-method-cod">💵 Cash on Delivery (COD)</span>
                    </p>
                    <p className="cod-notice">
                      ℹ️ Please pay ₹{order.totalPrice.toFixed(2)} to the delivery person when your order arrives.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Payment ID:</strong> {order.paymentDetails.razorpayPaymentId}
                    </p>
                    <p>
                      <strong>Invoice:</strong> {order.paymentDetails.receiptId}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={downloadInvoice} className="btn-invoice">
                📥 Download Invoice
              </button>
              <button onClick={() => navigate('/')} className="btn-continue">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;
