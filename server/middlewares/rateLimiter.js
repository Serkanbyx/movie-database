const rateLimit = require('express-rate-limit');

const rateLimitResponse = {
  success: false,
  message: 'Too many requests, please try again later.',
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: rateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: rateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
});

const tmdbLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: rateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { globalLimiter, authLimiter, tmdbLimiter };
