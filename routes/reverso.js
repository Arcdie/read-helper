const router = require('express').Router();

const getUser = require('../middlewares/get-user');
const getAuthToken = require('../middlewares/get-auth-token');

const reversoControllers = require('../controllers/reverso');

const commonMiddlewares = [
  getAuthToken,
  getUser,
];

router.post('/translate-phrase', commonMiddlewares, reversoControllers.getPhraseTranslation);

module.exports = router;
