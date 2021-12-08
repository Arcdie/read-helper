const router = require('express').Router();

const getUser = require('../../middlewares/get-user');
const getAuthToken = require('../../middlewares/get-auth-token');

const quizletControllers = require('../../controllers/translate-services/quizlet');

const commonMiddlewares = [
  getAuthToken,
  getUser,
];

router.post('/translate-phrase', commonMiddlewares, quizletControllers.getPhraseTranslation);

module.exports = router;
