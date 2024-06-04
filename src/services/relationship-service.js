const {
  RELATIONSHIP_TO_AUTH_USER,
  RELATIONSHIP_STATUS
} = require('../constants');
const prisma = require('../models/prisma');
const userService = require('./user-service');

const relationshipService = {};

// id: 1, id: 2
// SELECT * FROM relationship WHERE (senderId = 1 AND receiverId = 2) OR (senderId = 2 AND receiverId = 1)
relationshipService.findUserARelationToUserB = async (userAId, userBId) => {
  if (userAId === userBId) {
    return RELATIONSHIP_TO_AUTH_USER.ME;
  }

  const existRelationship = await prisma.relationship.findFirst({
    where: {
      OR: [
        { senderId: userAId, receiverId: userBId },
        { senderId: userBId, receiverId: userAId }
      ]
    }
  });

  if (!existRelationship) {
    return RELATIONSHIP_TO_AUTH_USER.UNKNOWN;
  }

  if (existRelationship.status === RELATIONSHIP_STATUS.ACCEPTED) {
    return RELATIONSHIP_TO_AUTH_USER.FRIEND;
  }

  if (existRelationship.senderId === userAId) {
    return RELATIONSHIP_TO_AUTH_USER.SENDER;
  }

  return RELATIONSHIP_TO_AUTH_USER.RECEIVER;
};

relationshipService.findReleationshipBetweenUserAAndUserB = (
  userAId,
  userBId
) =>
  prisma.relationship.findFirst({
    where: {
      OR: [
        { senderId: userAId, receiverId: userBId },
        { senderId: userBId, receiverId: userAId }
      ]
    }
  });

relationshipService.createRelationship = (senderId, receiverId) =>
  prisma.relationship.create({
    data: {
      senderId,
      receiverId,
      status: RELATIONSHIP_STATUS.PENDING
    }
  });

relationshipService.deleteRelationshipBySenderIdReceiverIdAndStatus = (
  senderId,
  receiverId,
  status
) =>
  prisma.relationship.deleteMany({
    where: { senderId, receiverId, status }
  });

relationshipService.findRelationshipBySenderIdReceiverIdAndStatus = (
  senderId,
  receiverId,
  status
) =>
  prisma.relationship.findFirst({
    where: { senderId, receiverId, status }
  });

relationshipService.updateRelationshipById = (status, id) =>
  prisma.relationship.update({
    data: { status },
    where: { id }
  });

relationshipService.deleteRelationshipById = id =>
  prisma.relationship.delete({ where: { id } });

// SELECT * FROM relationships WHERE status = 'ACCEPTED' AND (senderId = 3 OR receiverId = 3)
relationshipService.findFriendIdListByTargetUserId = async targetUserId => {
  const relationships = await prisma.relationship.findMany({
    where: {
      status: RELATIONSHIP_STATUS.ACCEPTED,
      OR: [{ senderId: targetUserId }, { receiverId: targetUserId }]
    }
  });
  const friendIdList = relationships.map(el =>
    el.senderId === targetUserId ? el.receiverId : el.senderId
  );
  return friendIdList;
};

relationshipService.findFriendsByTargetUserId = async targetUserId => {
  const friendIdList = await relationshipService.findFriendIdListByTargetUserId(
    targetUserId
  );
  return userService.findUserByIdList(friendIdList);
};

module.exports = relationshipService;
