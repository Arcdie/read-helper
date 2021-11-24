const router = require('express').Router();

router.use('/', require('./web'));
router.use('/api', require('./api'));
router.use('/auth', require('./auth'));

module.exports = router;
