const path = require('path');

const express = require('express');

const frontController = require('../controllers/front');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, frontController.getIndex);

router.get('/profile', isAuth, frontController.getProfile);

module.exports = router;