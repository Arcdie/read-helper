const {
  isUndefined,
} = require('lodash');

const {
  isMongoId,
} = require('validator');

const UserPhrase = require('../../models/UserPhrase');

module.exports = async (req, res, next) => {
  const {
    body: {
      userPhraseIds,

      isActive,
    },

    user,
  } = req;

  if (!user) {
    return res.json({
      status: false,
      message: 'Not authorized',
    });
  }

  if (!userPhraseIds || !Array.isArray(userPhraseIds)) {
    return res.json({
      status: false,
      message: 'No or invalid userPhraseIds',
    });
  }

  const userPhraseDocs = await UserPhrase.find({
    _id: { $in: userPhraseIds },
    user_id: user._id,
  }).exec();

  if (!userPhraseDocs || !userPhraseDocs.length) {
    return {
      status: true,
      result: [],
    };
  }

  if (!isUndefined(isActive)) {
    // userPhraseDocs.forEach() {
    //
    // }
  }

  return res.json({
    status: true,
  });
};
