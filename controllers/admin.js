const Lesson = require('../models/lesson');
const User = require('../models/user');

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
  Lesson.find()
    .then(lessons => {
      //console.log(lessons);
      res.render('admin/lessons', {
        lessons: lessons,
        pageTitle: 'Gestione Pratiche',
        path: '/admin/lessons'
      });
    }).catch(err => console.log(err));
};

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

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      console.info('users');
      res.render('admin/users', {
        users: users,
        pageTitle: 'Gestione utenti',
        path: '/admin/users'
      });
    }).catch(err => console.log(err));
};