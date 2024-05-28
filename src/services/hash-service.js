const bcrypt = require('bcryptjs');

const hashService = {};

hashService.hash = plainText => bcrypt.hash(plainText, 12);

module.exports = hashService;
