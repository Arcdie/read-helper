const router = require('express').Router();

router.use('/google', require('./google'));
router.use('/quizlet', require('./quizlet'));
router.use('/reverso', require('./reverso'));

module.exports = router;
