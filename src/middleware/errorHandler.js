const logger = require("../utils/logger.js");

function errorHandler(err, req, res, next) {

logger.error(err.message, { stack: err.stack });

 
  const statusCode = err.statusCode || 500;
const isKnownError = err.statusCode !== undefined;

res.status(statusCode).json({
  success: false,
  message: isKnownError ? err.message : "Something went wrong. Please try again later."
})
  
}

module.exports = errorHandler;