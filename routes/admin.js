const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isSuperuser = require('../middleware/is-superuser');

const router = express.Router();

router.get('/add-lesson', isAuth, isSuperuser, adminController.getAddLesson);

router.post('/add-lesson', isAuth, isSuperuser, adminController.postAddLesson);

router.get('/edit-lesson/:lessonId', isAuth, isSuperuser, adminController.getEditLesson);

router.post('/edit-lesson', isAuth, isSuperuser, adminController.postEditLesson);

router.post('/delete-lesson', isAuth, isSuperuser, adminController.postDeleteLesson);

router.get('/lessons', isAuth, isSuperuser, adminController.getLessons);

router.post('/reserve-anonym-slot', isAuth, adminController.postReserveAnonymSlot);

router.get('/users', isAuth, isSuperuser, adminController.getUsers);

router.post('/delete-user', isAuth, isSuperuser, adminController.postDeleteUser);

module.exports = router;