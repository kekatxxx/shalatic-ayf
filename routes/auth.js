const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

const Recaptcha = require('express-recaptcha').RecaptchaV3;
const recaptcha = new Recaptcha('6LcEm98dAAAAAIcVdCv3F9KZZhvZCIiOOLQAthJ9', '6LcEm98dAAAAAPAPX69buX1n77XSCxrE9CqyT8Dg');

router.get('/login', authController.getLogin);

// router.get('/signup', recaptcha.middleware.render, authController.getSignup);
router.get('/signup', recaptcha.middleware.render, function(req, res){
    res.render('auth/signup', { captcha:res.recaptcha });
});

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;