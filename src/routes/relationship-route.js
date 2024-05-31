const express = require('express');
const relationshipController = require('../controllers/relationship-controller');

const relationshipRouter = express.Router();

relationshipRouter.post(
  '/users/:receiverId',
  relationshipController.requestFriend
);

relationshipRouter.delete(
  '/users/:receiverId/cancel',
  relationshipController.cancelRequest
);

module.exports = relationshipRouter;
