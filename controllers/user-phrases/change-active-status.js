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
      message: 'No or empty userPhraseIds',
    });
  }

  let areValidIds = true;
  userPhraseIds.forEach(id => {
    if (!isMongoId(id)) {
      areValidIds = false;
      return false;
    }
  });

  if (!areValidIds) {
    return res.json({
      status: false,
      message: 'Invalid userPhraseIds',
    });
  }

  const userPhraseDocs = await UserPhrase.find({
    _id: { $in: userPhraseIds },
    user_id: user._id,
  }, { _id: 1 }).exec();

  if (!userPhraseDocs || !userPhraseDocs.length) {
    return { status: true };
  }

  await UserPhrase.updateMany({
    _id: { $in: userPhraseDocs.map(d => d._id) },
  }, {
    is_active: isActive,
  });

  return res.json({
    status: true,
  });
};
