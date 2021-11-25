const fs = require('fs');
const path = require('path');

const Book = require('../../models/Book');

module.exports = async (req, res, next) => {
  const {
    body: {
      bookName,
    },

    files: {
      bookFile,
      bookCoverImage,
    },

    user,
  } = req;

  if (!user) {
    return res.json({
      status: false,
      message: 'Not authorized',
    });
  }

  if (!bookName) {
    return res.json({
      status: false,
      message: 'No bookName',
    });
  }

  if (!bookFile) {
    return res.json({
      status: false,
      message: 'No bookFile',
    });
  }

  if (!bookCoverImage) {
    return res.json({
      status: false,
      message: 'No bookCoverImage',
    });
  }

  const newBook = new Book({
    name: bookName,
    created_by: user._id,
  });

  const newBookId = newBook._id.toString();

  const pathToBook = path.join(__dirname, `../../public/books/${newBookId}`);
  newBook.path_to_book = `/books/${newBookId}`;

  await newBook.save();

  fs.mkdirSync(pathToBook);

  // const bookCoverImageExtension = bookCoverImage[0].originalname.split('.')[1];

  const pathToBookFile = `${pathToBook}/book-file.pdf`;
  const pathToBookCoverImage = `${pathToBook}/book-cover-image.png`;

  fs.writeFileSync(pathToBookFile, bookFile[0].buffer);
  fs.writeFileSync(pathToBookCoverImage, bookCoverImage[0].buffer);

  return res.json({
    status: true,
    result: newBook._doc,
  });
};
