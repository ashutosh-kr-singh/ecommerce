const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  verifyPayment,
  getInvoice,
  getUserOrders,
  getOrderDetails,
} = require('../controllers/paymentController');

// Create Razorpay order
router.post('/create-order', protect, createOrder);

// Verify payment after successful transaction
router.post('/verify-payment', protect, verifyPayment);

// Get invoice for a specific order
router.get('/invoice/:orderId', protect, getInvoice);

// Get all orders for logged-in user
router.get('/my-orders', protect, getUserOrders);

// Get order details
router.get('/order-details/:orderId', protect, getOrderDetails);

module.exports = router;
