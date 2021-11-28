const router = require('express').Router();

router.use('/test', require('./test'));
router.use('/books', require('./books'));

module.exports = router;
