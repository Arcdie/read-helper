const {
  isMongoId,
} = require('validator');

const UserPhrase = require('../../models/UserPhrase');

module.exports = async (req, res, next) => {
  const {
    params: {
      id: userPhraseId,
    },

    user,
  } = req;

  if (!user) {
    return res.json({
      status: false,
      message: 'Not authorized',
    });
  }

  if (userPhraseId && !isMongoId(userPhraseId)) {
    return res.json({
      status: false,
      message: 'Invalid userPhraseId',
    });
  }

  const userPhraseDoc = await UserPhrase.findById(userPhraseId, {
    user_id: 1,
  }).exec();

  if (!userPhraseDoc) {
    return { status: true };
  }

  if (userPhraseDoc.user_id.toString() !== user._id.toString()) {
    return {
      status: false,
      message: 'phrase does not belongs to you',
    };
  }

  await UserPhrase.deleteOne({
    _id: userPhraseDoc._id,
  });

  return res.json({
    status: true,
  });
};
