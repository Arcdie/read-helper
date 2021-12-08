const router = require('express').Router();

const getUser = require('../middlewares/get-user');
const getAuthToken = require('../middlewares/get-auth-token');

const phraseTranslationControllers = require('../controllers/phrase-translations');

const commonMiddlewares = [
  getAuthToken,
  getUser,
];

router.post('/translate-phrase', commonMiddlewares, phraseTranslationControllers.getPhraseTranslation);

module.exports = router;
