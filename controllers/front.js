const Lesson = require('../models/lesson');
const User = require('../models/user');
const functions = require('../util/functions');
/**
 * getIndex()
 */
exports.getIndex = (req, res, next) => {
  let msgInf = req.flash('info');
  let msgErr = req.flash('error');
  if(msgInf.length > 0){
    msgInf = msgInf[0];
  }else{
    msgInf = null;
  }
  if(msgErr.length > 0){
    msgErr = msgErr[0];
  }else{
    msgErr = null;
  }
  Lesson.find()
    .then(lessons => {
      lessons = functions.orderByDate(lessons);
      res.render('front/home', {
        pageTitle: 'Shalatic',
        path: '/',
        lessons: lessons,
        messageInfo: msgInf,
        messageErr: msgErr
      });
    })
    .catch(err => {console.log(err)});
};

exports.getProfile = (req, res, next) => {
  if(!req.session.user){
    return res.redirect('/');
  }
  User.findById(req.session.user._id).then(user => {
      res.render('front/profile/home', {
        pageTitle: 'Profilo utente',
        path: '/profile',
        user: user
      });
    })
    .catch(err => {console.log(err)});
}

exports.getEditProfile = (req, res, next) => {
  if(!req.session.user){
    return res.redirect('/');
  }
  User.findById(req.session.user._id)
    .then(user => {
      res.render('front/profile/edit', {
        pageTitle: 'Profilo utente',
        path: '/profile',
        user: user
      });
    })
    .catch(err => {console.log(err)});
}

exports.postEditProfile = (req, res, next) => {
  const id = req.body.id;
  const updName = req.body.name;
  
  User.findById(id)
    .then(user => {
      user.name = updName;
      return user.save();
    })
    .then(result => {
      console.log('Profile modified.');
      res.redirect('/profile'); 
    }).catch(err => {
      console.log(err);
    });
}

exports.postReserveSlot = (req, res, next) => {
  const lessonId = req.body.lessonId;
  Lesson.findById(lessonId)
    .then(lesson => {
      return lesson.reserveSlot(req.session.user._id);
    })
    .then(result => {
      if(result){
        req.flash('info', 'Pratica prenotata con successo!');
      }else{
        req.flash('error', 'Non è stato possibile prenotare.');
      }
      res.redirect('/');
    })
    .catch(err => {console.log(err)});
};