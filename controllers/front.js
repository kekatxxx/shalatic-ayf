const Lesson = require('../models/lesson');
const User = require('../models/user');
const helpers = require('../util/helpers');
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
    .gte('date', new Date())
    .lte('date', new Date(new Date().getTime()+(7*24*60*60*1000)))
    .sort('date')
    .then(firstWeekles => {
      Lesson.find()
      .gt('date', new Date(new Date().getTime()+(7*24*60*60*1000)))
      .lte('date', new Date(new Date().getTime()+(14*24*60*60*1000)))
      .sort('date')
      .then(secondWeekles => {
        res.render('front/home', {
          pageTitle: 'Shalatic',
          path: '/',
          firstWeekles: firstWeekles,
          secondWeekles: secondWeekles,
          messageInfo: msgInf,
          messageErr: msgErr,
          helpers: helpers,
        });
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

exports.postCancelSlot = (req, res, next) => {
  const lessonId = req.body.lessonId;
  Lesson.findById(lessonId)
    .then(lesson => {
      return lesson.cancelSlot(req.session.user._id);
    })
    .then(result => {
      if(result){
        req.flash('info', 'Pratica annullata.');
      }else{
        req.flash('error', 'Non è stato possibile annullare la pratica.');
      }
      res.redirect('/');
    })
    .catch(err => {console.log(err)});
};

exports.getLessons = (req, res, next) => {
  if(!req.session.user){
    return res.redirect('/');
  }
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
  //Blog.$where('this.username.indexOf("val") !== -1').exec(function (err, docs) {});
  Lesson
    .find()
    .sort('date')
    .then(lessons => {
      userLessons = helpers.getLessonsByUserId(lessons, req.session.user._id);
      res.render('front/lessons', {
        pageTitle: 'Le mie prenotazioni',
        path: '/lessons',
        lessons: userLessons,
        messageInfo: msgInf,
        messageErr: msgErr,
        helpers: helpers,
      });
    })
    .catch(err => {console.log(err)});
}