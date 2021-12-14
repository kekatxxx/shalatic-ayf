const Lesson = require('../models/lesson');
const User = require('../models/user');
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
  User.findById(req.session.user._id)
    .then(user => {
      res.render('front/profile', {
        pageTitle: 'Profilo utente',
        path: '/profile',
        user: user
      });
    })
    .catch(err => {console.log(err)});
}