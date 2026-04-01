const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

// GST Configuration (can be customized per product category)
const GST_RATES = {
  Electronics: 18,
  // Add more categories as needed
};

// Calculate GST amount
const calculateGST = (subtotal, gstRate = 18) => {
  return Math.round((subtotal * gstRate) / 100 * 100) / 100; // Round to 2 decimals
};

// Create Order (supports both COD and Online Payment)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, customerEmail, customerPhone, gstinBuyer, paymentMethod = 'cod' } = req.body;

    console.log('📦 Creating order with:', { items, customerEmail, customerPhone, paymentMethod });
    console.log('👤 User info:', req.user);

    // Check authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: 'Please login first to place an order' 
      });
    }

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Cart is empty' 
      });
    }

    if (!shippingAddress || !customerEmail || !customerPhone) {
      return res.status(400).json({ 
        success: false,
        message: 'Please fill in all required fields' 
      });
    }

    // Fetch product details
    const productIds = items.map((item) => item.product);
    console.log('🔍 Fetching products:', productIds);
    
    const products = await Product.find({ _id: { $in: productIds } });
    
    if (products.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Products not found' 
      });
    }

    // Calculate subtotal
    let subtotal = 0;
    const itemsWithDetails = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.product);
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    // Calculate GST (18% as default)
    const gstRate = 18;
    const gstAmount = calculateGST(subtotal, gstRate);
    const totalPrice = subtotal + gstAmount;

    // Determine order status based on payment method
    const orderStatus = paymentMethod === 'cod' ? 'paid' : 'pending';

    // Create order in database
    const order = new Order({
      user: req.user._id,
      items: itemsWithDetails,
      subtotal,
      gstRate,
      gstAmount,
      totalPrice,
      shippingAddress,
      customerEmail,
      customerPhone,
      paymentMethod,
      invoiceDetails: {
        gstinBuyer,
      },
      status: orderStatus,
    });

    await order.save();

    console.log(`✅ Order created with status "${orderStatus}": ${order._id}`);

    res.status(201).json({
      success: true,
      orderId: order._id,
      amount: totalPrice,
      subtotal,
      gstAmount,
      gstRate,
      currency: 'INR',
      customerEmail,
      customerPhone,
      paymentMethod,
      message: paymentMethod === 'cod' ? '✅ Order confirmed! You will pay at delivery.' : 'Proceed to payment'
    });
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Verify Payment and Create Invoice
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = req.body;

    // Verify Razorpay signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Update order status to paid
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          'paymentDetails.razorpayPaymentId': razorpayPaymentId,
          'paymentDetails.razorpaySignature': razorpaySignature,
          'paymentDetails.receiptId': `RCP-${Date.now()}`,
          'invoiceDetails.invoiceNumber': `INV-${Date.now()}`,
          'invoiceDetails.invoiceDate': new Date(),
          status: 'paid',
        },
      },
      { new: true }
    ).populate('items.product user');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order,
      invoice: generateInvoice(order),
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

// Generate Invoice Data
const generateInvoice = (order) => {
  return {
    invoiceNumber: order.paymentDetails.receiptId,
    invoiceDate: order.invoiceDetails.invoiceDate,
    orderDate: order.createdAt,
    orderId: order._id,
    customer: {
      email: order.customerEmail,
      phone: order.customerPhone,
      address: order.shippingAddress,
      gstin: order.invoiceDetails.gstinBuyer,
    },
    items: order.items,
    subtotal: order.subtotal,
    gstRate: order.gstRate,
    gstAmount: order.gstAmount,
    totalAmount: order.totalPrice,
    paymentMethod: order.paymentMethod,
    razorpayPaymentId: order.paymentDetails.razorpayPaymentId,
  };
};

// Get Order Invoice (for download)
exports.getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('items.product user');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const invoice = generateInvoice(order);
    res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Error fetching invoice', error: error.message });
  }
};

// Get All Orders (for user)
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get Single Order Details
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has permission to view this order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};
