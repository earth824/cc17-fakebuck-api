const express = require('express');
const upload = require('../middlewares/upload');
const postController = require('../controllers/post-controller');

const postRouter = express.Router();

postRouter.post('/', upload.single('image'), postController.createPost);

module.exports = postRouter;
