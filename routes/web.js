const router = require('express').Router();

const getUser = require('../middlewares/get-user');
const getAuthToken = require('../middlewares/get-auth-token');

const webControllers = require('../controllers/web');

const commonMiddlewares = [
  getAuthToken,
  getUser,
];

router.get('/', commonMiddlewares, webControllers.getMainPage);
router.get('/bookcase', commonMiddlewares, webControllers.getBookcasePage);

module.exports = router;
