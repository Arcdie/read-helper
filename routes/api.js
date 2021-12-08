const router = require('express').Router();

router.use('/test', require('./test'));
router.use('/books', require('./books'));

router.use('/user-phrases', require('./user-phrases'));
router.use('/phrase-translations', require('./phrase-translations'));

// translate services
router.use('/google', require('./translate-services/google'));
router.use('/quizlet', require('./translate-services/quizlet'));
router.use('/reverso', require('./translate-services/reverso'));

module.exports = router;
