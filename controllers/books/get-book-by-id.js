const {
  isMongoId,
} = require('validator');

const {
  getBookById,
} = require('./utils/get-book-by-id');

module.exports = async (req, res, next) => {
  const {
    params: {
      id: bookId,
    },

    user,
  } = req;

  if (!user) {
    return res.json({
      status: false,
      message: 'Not authorized',
    });
  }

  if (!bookId || !isMongoId(bookId.toString())) {
    return res.json({
      status: false,
      message: 'No or invalid bookId',
    });
  }

  const resultGetBook = await getBookById({
    bookId,
  });

  if (!resultGetBook || !resultGetBook.status) {
    return res.json({
      status: false,
      message: resultGetBook.message || 'Cant getBookById',
    });
  }

  return res.json({
    status: true,
    result: resultGetBook.result,
  });
};
