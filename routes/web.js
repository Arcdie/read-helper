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
router.get('/test2', commonMiddlewares, webControllers.getTest2Page);

router.get('/books', commonMiddlewares, webControllers.getBooksPage);
router.get('/books/add', commonMiddlewares, webControllers.getAddBookPage);

router.get('/books/:id', commonMiddlewares, webControllers.getBookPage);
router.get('/books/:id/read', commonMiddlewares, webControllers.getReadBookPage);

module.exports = router;
