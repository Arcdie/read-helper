const {
  isMongoId,
} = require('validator');

const UserQuizletRequest = require('../../../models/UserQuizletRequest');

const createUserQuizletRequest = async ({
  userId,
  phrase,
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

  const newRequest = new UserQuizletRequest({
    user_id: userId,
    phrase,
  });

  await newRequest.save();

  return {
    status: true,
    result: newRequest._doc,
  };
};

module.exports = {
  createUserQuizletRequest,
};
