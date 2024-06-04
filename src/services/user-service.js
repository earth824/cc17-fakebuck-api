const prisma = require('../models/prisma');

const userFiltered = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  mobile: true,
  profileImage: true,
  coverImage: true,
  createdAt: true,
  updatedAt: true
};

const userService = {};

userService.createUser = data => prisma.user.create({ data });
userService.findUserByEmailOrMobile = emailOrMobile =>
  prisma.user.findFirst({
    where: {
      OR: [{ email: emailOrMobile }, { mobile: emailOrMobile }]
    }
  });

userService.findUserById = userId =>
  prisma.user.findUnique({ where: { id: userId } });

userService.updateUserById = (data, userId) =>
  prisma.user.update({
    where: {
      id: userId
    },
    data
  });

userService.findUserByIdList = idList =>
  prisma.user.findMany({
    where: {
      id: {
        in: idList
      }
    },
    select: userFiltered
  });

module.exports = userService;
