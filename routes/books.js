const multer = require('multer');

const router = require('express').Router();

const getUser = require('../middlewares/get-user');
const getAuthToken = require('../middlewares/get-auth-token');

const bookControllers = require('../controllers/books');

const commonMiddlewares = [
  getAuthToken,
  getUser,
];

const upload = multer();

router.get('/', commonMiddlewares, bookControllers.getBooks);
router.get('/:id', commonMiddlewares, bookControllers.getBookById);

router.post('/',
  commonMiddlewares,
  upload.fields([{ name: 'bookFile' }, { name: 'bookCoverImage' }]),
  bookControllers.createBook,
);

module.exports = router;
