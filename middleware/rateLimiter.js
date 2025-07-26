const rateLimit = require('express-rate-limit');

// 🧾 Limit: 5 requests per 10 minutes per IP for sensitive actions like payment
const paymentRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    message: 'Too many payment attempts from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { paymentRateLimiter };
