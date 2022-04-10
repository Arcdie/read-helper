const {
  isMongoId,
} = require('validator');

const {
  getBookById,
} = require('../books/utils/get-book-by-id');

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
    return next(resultGetBook.message || 'Cant getBookById');
  }

  const bookDoc = resultGetBook.result;

  res.render('web/book-page', {
    pageTitle: `${bookDoc.name}`,
    bookDoc,
  });
};
