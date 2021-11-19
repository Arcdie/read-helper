const router = require('express').Router();

const getUser = require('../middlewares/get-user');
const getAuthToken = require('../middlewares/get-auth-token');

const webControllers = require('../controllers/web');

const commonMiddlewares = [
  getAuthToken,
];

const extendedMiddlewares = [
  ...commonMiddlewares,
  getUser,
];

router.get('/', webControllers.getMainPage);

module.exports = router;
