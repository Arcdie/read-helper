const {
  isMongoId,
} = require('validator');

const UserPhrase = require('../../models/UserPhrase');

module.exports = async (req, res, next) => {
  const {
    query: {
      bookId,
    },

    user,
  } = req;

  if (!user) {
    return res.json({
      status: false,
      message: 'Not authorized',
    });
  }

  if (bookId && !isMongoId(bookId)) {
    return res.json({
      status: false,
      message: 'No or invalid bookId',
    });
  }

  const findObj = {
    user_id: user._id,
  };

  if (bookId) {
    findObj.book_id = bookId;
  }

  const userPhrases = await UserPhrase.find(findObj, {
    phrase: 1,
    phrase_translation: 1,
  }).exec();

  return res.json({
    status: true,
    result: userPhrases.map(doc => doc._doc),
  });
};
