const cloudinary = require('../config/cloudinary');

const uploadService = {};

uploadService.upload = path => {
  return cloudinary.uploader.upload(path);
};

module.exports = uploadService;
