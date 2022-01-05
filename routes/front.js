const path = require('path');

const express = require('express');

const frontController = require('../controllers/front');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, frontController.getIndex);

router.get('/profile', isAuth, frontController.getProfile);

router.get('/edit-profile', isAuth, frontController.getEditProfile);

router.post('/edit-profile', isAuth, frontController.postEditProfile);

router.post('/reserve-slot', isAuth, frontController.postReserveSlot);

router.post('/cancel-slot', isAuth, frontController.postCancelSlot);

module.exports = router;