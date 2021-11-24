const router = require('express').Router();

const getAuthToken = require('../middlewares/get-auth-token');

const webControllers = require('../controllers/web');
const userControllers = require('../controllers/users');

router.get('/login', getAuthToken, webControllers.getLoginPage);
router.get('/registration', getAuthToken, webControllers.getRegistrationPage);

router.post('/login', getAuthToken, userControllers.login);
router.post('/registration', getAuthToken, userControllers.createUser);

module.exports = router;
