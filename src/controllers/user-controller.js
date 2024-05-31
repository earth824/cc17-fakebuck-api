const fs = require('fs/promises');

const uploadService = require('../services/upload-service');
const userService = require('../services/user-service');
const createError = require('../utils/create-error');
const relationshipService = require('../services/relationship-service');

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

userController.getProfileUser = async (req, res, next) => {
  // profileId ===> +req.params.profileId
  // authUserId ===> req.user.id
  try {
    const profileUser = await userService.findUserById(+req.params.profileId);
    if (!profileUser) {
      createError({
        message: 'this profile user was not found',
        statusCode: 400
      });
    }

    delete profileUser.password;

    const relationshipToAuthUser =
      await relationshipService.findUserARelationToUserB(
        +req.params.profileId,
        req.user.id
      );

    res.status(200).json({ user: profileUser, relationshipToAuthUser });
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
