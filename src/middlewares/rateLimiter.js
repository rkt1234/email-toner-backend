// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

exports.emailRateLimiter = rateLimit({
  windowMs: process.env.WINDOW_WIDTH * 60 * 1000, // 15 minutes
  max: process.env.EMAIL_SERVICE_LIMIT, // limit each IP to 1 requests per windowMs
  message: {
    status: 429,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

