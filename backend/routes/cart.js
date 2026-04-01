// filepath: c:\Users\ck2018\OneDrive\Desktop\E-commerce\backend\routes\cart.js
const express = require('express');
const { addToCart, getCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, addToCart);
router.get('/', protect, getCart);

module.exports = router;