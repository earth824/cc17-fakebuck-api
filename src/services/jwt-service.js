const jwt = require('jsonwebtoken');

const jwtService = {};

jwtService.sign = payload =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

module.exports = jwtService;
