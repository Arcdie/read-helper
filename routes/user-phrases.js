const router = require('express').Router();

const getUser = require('../middlewares/get-user');
const getAuthToken = require('../middlewares/get-auth-token');

const userPhraseControllers = require('../controllers/user-phrases');

const commonMiddlewares = [
  getAuthToken,
  getUser,
];

router.get('/', commonMiddlewares, userPhraseControllers.getUserPhrases);
router.post('/', commonMiddlewares, userPhraseControllers.createUserPhrase);

router.delete('/:id', commonMiddlewares, userPhraseControllers.removeUserPhrase);

module.exports = router;
