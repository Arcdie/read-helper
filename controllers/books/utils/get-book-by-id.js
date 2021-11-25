const {
  isMongoId,
} = require('validator');

const Book = require('../../../models/Book');

const getBookById = async ({
  bookId,
}) => {
  if (!bookId || !isMongoId(bookId.toString())) {
    return {
      status: false,
      message: 'No or invalid userId',
    };
  }

  const bookDoc = await Book.findById(bookId).exec();

  if (!bookDoc) {
    return {
      status: false,
      message: 'No Book',
    };
  }

  if (!bookDoc.is_active) {
    return {
      status: false,
      message: 'Book is not active',
    };
  }

  return {
    status: true,
    result: bookDoc._doc,
  };
};

module.exports = {
  getBookById,
};
