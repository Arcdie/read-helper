const {
  isMongoId,
} = require('validator');

const UserPhrase = require('../../models/UserPhrase');

module.exports = async (req, res, next) => {
  const {
    body: {
      bookId,
      phrase,
      translation,
    },

    user,
  } = req;

  if (!user) {
    return res.json({
      status: false,
      message: 'Not authorized',
    });
  }

  if (!phrase) {
    return res.json({
      status: false,
      message: 'No phrase',
    });
  }

  if (!translation) {
    return res.json({
      status: false,
      message: 'No translation',
    });
  }

  if (bookId && !isMongoId(bookId)) {
    return res.json({
      status: false,
      message: 'Invalid bookId',
    });
  }

  const newUserPhrase = new UserPhrase({
    user_id: user._id,
    phrase: phrase.trim(),
    phrase_translation: translation.trim(),
  });

  if (bookId) {
    newUserPhrase.book_id = bookId;
  }

  await newUserPhrase.save();

  return res.json({
    status: true,
    result: newUserPhrase._doc,
  });
};
