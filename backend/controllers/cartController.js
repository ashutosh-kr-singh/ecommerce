
const Order = require('../models/Order');

// @desc Add to cart / Create order
// @route POST /api/cart
exports.addToCart = async (req, res) => {
  try {
    const { items, shippingAddress, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
      shippingAddress: shippingAddress || 'Not provided',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user orders
// @route GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};