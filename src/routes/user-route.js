const express = require('express');
const upload = require('../middlewares/upload');
const userController = require('../controllers/user-controller');

const userRouter = express.Router();

userRouter.patch(
  '/',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  userController.updateProfileOrCoverImage
);

module.exports = userRouter;
