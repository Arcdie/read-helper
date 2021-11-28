const router = require('express').Router();

const getUser = require('../middlewares/get-user');
const getAuthToken = require('../middlewares/get-auth-token');

const userPhraseControllers = require('../controllers/user-phrases');

const commonMiddlewares = [
  getAuthToken,
  getUser,
];

router.post('/', commonMiddlewares, userPhraseControllers.createUserPhrase);

module.exports = router;
