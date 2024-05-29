const express = require('express');
const authController = require('../controllers/auth-controller');
const {
  registerValidator,
  loginValidator
} = require('../middlewares/validator');
const authenticate = require('../middlewares/authenticate');

const authRouter = express.Router();

authRouter.post('/register', registerValidator, authController.register);
authRouter.post('/login', loginValidator, authController.login);
authRouter.get('/me', authenticate, authController.getMe);

module.exports = authRouter;
