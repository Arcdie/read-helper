const router = require('express').Router();

router.use('/test', require('./test'));
router.use('/books', require('./books'));

router.use('/quizlet', require('./quizlet'));

router.use('/user-phrases', require('./user-phrases'));

module.exports = router;
