const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const authenticate = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      data: null,
      message: 'Access token required' ,
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'server_secret_key');

    // Attach user to request (excluding password)
    const user = await User.findById(decoded._id)
      .select('-password')
    //  .populate('refId', '-createdAt -updatedAt'); // populate refId without certain fields
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        data: null,
        message: 'User not found' 
      });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        data: null,
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        data: null,
        message: 'Token expired' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      data: null,
      message: 'Authentication error' 
    });
  }
};

// Middleware to restrict access to certain roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        data: null,
        message: 'Authentication required' 
    });
  }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        data: null,
        message: `Role (${req.user.role}) not authorized` 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
