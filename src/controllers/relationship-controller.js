const { RELATIONSHIP_STATUS } = require('../constants');
const relationshipService = require('../services/relationship-service');
const userService = require('../services/user-service');
const createError = require('../utils/create-error');

const relationshipController = {};

relationshipController.requestFriend = async (req, res, next) => {
  try {
    if (+req.params.receiverId === req.user.id) {
      createError({
        message: 'sender id and receiver id must be different',
        statusCode: 400
      });
    }

    const existUser = await userService.findUserById(+req.params.receiverId);
    if (!existUser) {
      createError({
        message: 'user was not found',
        statusCode: 400
      });
    }

    const existRelationship =
      await relationshipService.findReleationshipBetweenUserAAndUserB(
        +req.params.receiverId,
        req.user.id
      );

    if (existRelationship) {
      createError({
        message: 'already have relationship',
        statusCode: 400
      });
    }

    await relationshipService.createRelationship(
      req.user.id,
      +req.params.receiverId
    );
    res.status(200).json({ message: 'request has been sent' });
  } catch (err) {
    next(err);
  }
};

relationshipController.cancelRequest = async (req, res, next) => {
  try {
    const existRelationship =
      await relationshipService.findReleationshipBetweenUserAAndUserB(
        req.user.id,
        +req.params.receiverId
      );

    if (!existRelationship) {
      createError({
        message: 'relationship not exists',
        statusCode: 400
      });
    }

    if (
      existRelationship.senderId !== req.user.id &&
      existRelationship.status !== RELATIONSHIP_STATUS.PENDING
    ) {
      createError({
        message: 'this user cannot cancel this request',
        statusCode: 400
      });
    }

    await relationshipService.deleteRelationshipBySenderIdReceiverIdAndStatus(
      req.user.id,
      +req.params.receiverId,
      RELATIONSHIP_STATUS.PENDING
    );

    res.status(204).json({ message: 'relationship terminated' });
  } catch (err) {
    next(err);
  }
};

relationshipController.confirmRequest = async (req, res, next) => {
  try {
    const existRelationship =
      await relationshipService.findRelationshipBySenderIdReceiverIdAndStatus(
        +req.params.senderId,
        req.user.id,
        RELATIONSHIP_STATUS.PENDING
      );

    if (!existRelationship) {
      createError({
        message: 'relationship did not exists',
        statusCode: 400
      });
    }

    await relationshipService.updateRelationshipById(
      RELATIONSHIP_STATUS.ACCEPTED,
      existRelationship.id
    );

    res.status(200).json({ message: 'request accepted' });
  } catch (err) {
    next(err);
  }
};

relationshipController.rejectRequest = async (req, res, next) => {
  try {
    const existRelationship =
      await relationshipService.findRelationshipBySenderIdReceiverIdAndStatus(
        +req.params.senderId,
        req.user.id,
        RELATIONSHIP_STATUS.PENDING
      );

    if (!existRelationship) {
      createError({
        message: 'relationship did not exists',
        statusCode: 400
      });
    }

    await relationshipService.deleteRelationshipById(existRelationship.id);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

relationshipController.unfriend = async (req, res, next) => {
  try {
    const existRelationship =
      await relationshipService.findReleationshipBetweenUserAAndUserB(
        +req.params.targetUserId,
        req.user.id
      );

    if (
      !existRelationship ||
      existRelationship.status !== RELATIONSHIP_STATUS.ACCEPTED
    ) {
      createError({
        message: 'relationship did not exists',
        statusCode: 400
      });
    }

    await relationshipService.deleteRelationshipById(existRelationship.id);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

module.exports = relationshipController;
