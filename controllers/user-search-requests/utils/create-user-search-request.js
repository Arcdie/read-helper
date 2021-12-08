const {
  isMongoId,
} = require('validator');

const UserSearchRequest = require('../../../models/UserSearchRequest');

const {
  TYPES_RESOURCES,
} = require('../constants');

const createUserSearchRequest = async ({
  userId,
  phrase,
  typeResource,
}) => {
  if (!userId || !isMongoId(userId.toString())) {
    return {
      status: false,
      message: 'No or invalid userId',
    };
  }

  if (!phrase) {
    return {
      status: false,
      message: 'No phrase',
    };
  }

  if (!typeResource || !TYPES_RESOURCES.get(typeResource)) {
    return {
      status: false,
      message: 'No or invalid typeResource',
    };
  }

  const newRequest = new UserSearchRequest({
    user_id: userId,
    phrase,
    resource: typeResource,
  });

  await newRequest.save();

  return {
    status: true,
    result: newRequest._doc,
  };
};

module.exports = {
  createUserSearchRequest,
};
