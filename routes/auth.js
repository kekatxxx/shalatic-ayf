const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login', 
    [
        body('email')
            .isEmail()
            .withMessage('Inserisci una mail valida.')
            .normalizeEmail(),
        body('password', 'La password deve essere di almeno 5 caratteri alfanumerici')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin);

router.post('/signup', 
    [
        check('email')
            .isEmail()
            .withMessage('Inserisci una mail valida.')
            .custom((value, { req }) => {
                // if (value === 'test@test.com') {
                //   throw new Error('This email address if forbidden.');
                // }
                // return true;
                return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject(
                    'Indirizzo mail già presente, utilizza un\'altro.'
                    );
                }
                });
            })
            .normalizeEmail(),
        body(
            'password',
            'La password deve essere di almeno 5 caratteri alfanumerici.'
            )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                throw new Error('La password non combacia.');
                }
                return true;
            })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;