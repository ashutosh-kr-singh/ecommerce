const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.error('❌ No token provided in authorization header');
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route - No token provided' 
    });
  }

  try {
    console.log('🔐 Verifying token...');
    console.log('JWT_SECRET configured:', !!process.env.JWT_SECRET);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('👤 User ID from token:', decoded.id);
    
    req.user = { _id: decoded.id }; // Set _id property
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    console.error('Error type:', error.name);
    
    let message = 'Not authorized to access this route';
    if (error.name === 'TokenExpiredError') {
      message = 'Token has expired. Please login again.';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token. Please login again.';
    }
    
    return res.status(401).json({ 
      success: false, 
      message 
    });
  }
};

module.exports = { protect };