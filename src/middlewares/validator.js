const createError = require('../utils/create-error');
const { registerSchema, loginSchema } = require('../validator/auth-validator');

exports.registerValidator = (req, res, next) => {
  const { value, error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  req.input = value;
  next();
};

exports.loginValidator = (req, res, next) => {
  const { value, error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  req.input = value;
  next();
};

exports.validateUpdateProfileOrCoverImage = (req, res, next) => {
  if (!req.files) {
    createError({
      message: 'at least one of profile or cover image',
      statusCode: 400
    });
  }
  next();
};
