const router = require('express').Router();

const testControllers = require('../controllers/test');

router.get('/check', testControllers.check);
router.post('/check', testControllers.check);

router.post('/message', testControllers.getMessage);

module.exports = router;
