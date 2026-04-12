const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Not authorized, no token provided');
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error('Not authorized, user not found');
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    req.user = user || null;
    next();
  } catch {
    req.user = null;
    next();
  }
};

module.exports = { protect, optionalAuth };
