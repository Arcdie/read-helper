const router = require('express').Router();

const getUser = require('../../middlewares/get-user');
const getAuthToken = require('../../middlewares/get-auth-token');

const googleControllers = require('../../controllers/translate-services/google');

const commonMiddlewares = [
  getAuthToken,
  getUser,
];

router.post('/translate-phrase', commonMiddlewares, googleControllers.getPhraseTranslation);

module.exports = router;
