const router = require('express').Router();

const testControllers = require('../controllers/test');

router.post('/message', testControllers.getMessage);

module.exports = router;
