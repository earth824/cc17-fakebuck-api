const express = require('express');
const upload = require('../middlewares/upload');
const userController = require('../controllers/user-controller');
const {
  validateUpdateProfileOrCoverImage
} = require('../middlewares/validator');

const userRouter = express.Router();

userRouter.patch(
  '/',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  validateUpdateProfileOrCoverImage,
  userController.updateProfileOrCoverImage
);

userRouter.get('/:profileId', userController.getProfileUser);

module.exports = userRouter;
