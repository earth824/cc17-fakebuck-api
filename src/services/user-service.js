const prisma = require('../models/prisma');

const userService = {};

userService.createUser = data => prisma.user.create({ data });
userService.findUserByEmailOrMobile = emailOrMobile =>
  prisma.user.findFirst({
    where: {
      OR: [{ email: emailOrMobile }, { mobile: emailOrMobile }]
    }
  });

module.exports = userService;
