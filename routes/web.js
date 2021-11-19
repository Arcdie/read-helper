const router = require('express').Router();

const webControllers = require('../controllers/web');

const commonMiddlewares = [];
const extendedMiddlewares = [...commonMiddlewares];

// router.get('/', webControllers.getMainPage);

module.exports = router;
