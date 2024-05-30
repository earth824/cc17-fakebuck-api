const uploadService = require('../services/upload-service');
const userService = require('../services/user-service');

const userController = {};

userController.updateProfileOrCoverImage = async (req, res, next) => {
  try {
    const data = {};
    if (req.files.profileImage) {
      data.profileImage = req.files.profileImage[0].path;
      const result = await uploadService.upload(req.files.profileImage[0].path);
      console.log(result);
    }
    if (req.files.coverImage) {
      data.coverImage = req.files.coverImage[0].path;
    }

    await userService.updateUserById(data, req.user.id);

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
