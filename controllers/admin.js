const Lesson = require('../models/lesson');
const User = require('../models/user');
const functions = require('../util/functions');

exports.getAddLesson = (req, res, next) => {
  res.render('admin/edit-lesson', {
    pageTitle: 'Aggiungi pratica',
    path: '/admin/add-lesson',
    editMode: false
  });
};

exports.postAddLesson = (req, res, next) => {
  const date = req.body.date;
  const slots = req.body.slots;
  const type = req.body.type;
  const lesson = new Lesson({
    date: date,
    maxSlots: slots,
    type: type,
    participants: []
  });
  lesson
    .save()
    .then(result => {
      console.log('Lesson created.');
      res.redirect('/admin/lessons'); 
    }).catch(err => {
      console.log(err);
    });
};

exports.postEditLesson = (req, res, next) => {
  const id = req.body.id;
  const updDate = req.body.date;
  const updSlots = req.body.slots;
  const updType = req.body.type;
  
  Lesson.findById(id)
    .then(lesson => {
      lesson.date = updDate;
      lesson.maxSlots = updSlots;
      lesson.type = updType;
      return lesson.save();
    })
    .then(result => {
      console.log('Lesson modified.');
      res.redirect('/admin/lessons'); 
    }).catch(err => {
      console.log(err);
    });
};

exports.getEditLesson = (req, res, next) => {
  const editQueryParam = req.query.edit; //queryparams [url]?edit=1
  if(!editQueryParam){
    res.redirect('/');
  }
  const lessId = req.params.lessonId;
  Lesson.findById(lessId)
    .then(lesson => {
      if(!lesson){
        return res.redirect('/');
      }
      res.render('admin/edit-lesson', {
        pageTitle: 'Modifica pratica',
        path: '/admin/lessons',
        editMode: true,
        lesson: lesson
      })
    }).catch(err => console.log(err));
};

exports.postDeleteLesson = (req, res, next) => {
  Lesson.findByIdAndRemove(req.body.lessonId)
    .then(result => {
      console.log('Lesson destroyed');
      res.redirect('/admin/lessons'); 
    })
    .catch(err => console.log(err));
};

exports.getLessons = (req, res, next) => {
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
  Lesson
    .find()
    .populate('participants.userId')
    .then(lessons => {
      lessons = functions.orderByDate(lessons, true);
      res.render('admin/lessons', {
        lessons: lessons,
        pageTitle: 'Gestione Pratiche',
        path: '/admin/lessons',
        messageInfo: msgInf,
        messageErr: msgErr
      });
    }).catch(err => console.log(err));

  // Lesson
  //   .find()
  //   .then(lessons => {
  //     console.log('getLessons');
  //     res.render('admin/lessons', {
  //       lessons: lessons,
  //       pageTitle: 'Gestione Pratiche',
  //       path: '/admin/lessons'
  //     });
  //   }).catch(err => console.log(err));
};

exports.postReserveAnonymSlot = (req, res, next) => {
  const lessonId = req.body.lessonId;
  const name = req.body.name;
  Lesson.findById(lessonId)
    .then(lesson => {
      return lesson.reserveAnonymSlot(name);
    })
    .then(result => {
      if(result){
        req.flash('info', 'Prenotazione rapida aggiunta.');
      }else{
        req.flash('error', 'Non è stato possibile aggiungere la prenotazione.');
      }
      res.redirect('/admin/lessons');
    })
    .catch(err => {console.log(err)});
};

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      users.sort((a, b)=>{
        if(a.superuser && !b.superuser){
          return -1;
        }else{
          return 1;
        }
      });
      res.render('admin/users', {
        users: users,
        pageTitle: 'Gestione utenti',
        path: '/admin/users'
      });
    }).catch(err => console.log(err));
};

exports.postDeleteUser = (req, res, next) => {
  User.findByIdAndRemove(req.body.userId)
    .then(result => {
      console.log('User destroyed');
      res.redirect('/admin/users'); 
    })
    .catch(err => console.log(err));
};