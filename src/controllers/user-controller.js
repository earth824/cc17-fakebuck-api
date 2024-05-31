const fs = require('fs/promises');

const uploadService = require('../services/upload-service');
const userService = require('../services/user-service');

const userController = {};

userController.updateProfileOrCoverImage = async (req, res, next) => {
  try {
    const promises = [];

    if (req.files.profileImage) {
      const result = uploadService
        .upload(req.files.profileImage[0].path)
        .then(url => ({ url, key: 'profileImage' }));
      promises.push(result);
    }
    if (req.files.coverImage) {
      const result = uploadService
        .upload(req.files.coverImage[0].path)
        .then(url => ({ url, key: 'coverImage' }));
      promises.push(result);
    }

    const result = await Promise.all(promises);

    const data = result.reduce((acc, el) => {
      acc[el.key] = el.url;
      return acc;
    }, {});

    await userService.updateUserById(data, req.user.id);

    res.status(200).json(data);
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profileImage) {
      fs.unlink(req.files.profileImage[0].path);
    }
    if (req.files.coverImage) {
      fs.unlink(req.files.coverImage[0].path);
    }
  }
};

module.exports = userController;
