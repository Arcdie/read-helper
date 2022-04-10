const Book = require('../../models/Book');
const UserBookBound = require('../../models/UserBookBound');

module.exports = async (req, res, next) => {
  const {
    user,
  } = req;

  if (!user) {
    return res.json({
      status: false,
      message: 'Not authorized',
    });
  }

  const userBookBounds = await UserBookBound.find({
    user_id: user._id,
    is_active: true,
  }, { book_id: 1 }).exec();

  if (!userBookBounds.length) {
    return res.json({
      status: true,
      result: [],
    });
  }

  const booksIds = userBookBounds.map(bound => bound.book_id);

  const booksDocs = await Book.find({
    _id: { $in: booksIds },
    is_active: true,
  }).exec();

  return res.json({
    status: true,
    result: booksDocs.map(doc => doc._doc),
  });
};
