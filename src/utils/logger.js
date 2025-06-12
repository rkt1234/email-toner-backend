// src/utils/logger.js
const { createLogger, format, transports } = require('winston');

exports.logger = createLogger({
  level: 'info', // Default level
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }), // Capture stack traces
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Nice colors for console
        format.simple()
      )
    }),

    // Optional: log to a file (uncomment in prod)
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' })
  ]
});
