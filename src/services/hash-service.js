const bcrypt = require('bcryptjs');

const hashService = {};

hashService.hash = plainText => bcrypt.hash(plainText, 12);
hashService.compare = (plainText, hashValue) =>
  bcrypt.compare(plainText, hashValue);

module.exports = hashService;
