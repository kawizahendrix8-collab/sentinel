function validateRequest(requiredFields) {
  return function(req, res, next) {

    const missingFields = requiredFields.filter(function(field) {
      return !req.body[field];
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: " + missingFields.join(", ")
      });
    }

    next();
  };
}

module.exports = validateRequest;