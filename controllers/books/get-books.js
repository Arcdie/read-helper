const Book = require('../../models/Book');

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

  const booksDocs = await Book.find({
    is_active: true,
  }).exec();

  return res.json({
    status: true,
    result: booksDocs.map(doc => doc._doc),
  });
};
