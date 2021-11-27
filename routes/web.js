const router = require('express').Router();

const getUser = require('../middlewares/get-user');
const getAuthToken = require('../middlewares/get-auth-token');

const webControllers = require('../controllers/web');

const commonMiddlewares = [
  getAuthToken,
  getUser,
];

router.get('/', commonMiddlewares, webControllers.getMainPage);
router.get('/test', commonMiddlewares, webControllers.getTestPage);

router.get('/books/:id', commonMiddlewares, webControllers.getBookPage);
router.get('/books/:id/read', commonMiddlewares, webControllers.getReadBookPage);

router.get('/books', commonMiddlewares, webControllers.getBooksPage);
router.get('/books/add', commonMiddlewares, webControllers.getAddBookPage);

module.exports = router;
