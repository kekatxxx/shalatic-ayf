const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const constants = require('../util/constants');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key: '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'
  }
}));

exports.getLogin = (req, res, next) => {
  let mesErr = req.flash('error');
  let mesInf = req.flash('info');
  if(mesErr.length > 0){
    mesErr = mesErr[0];
  }else{
    mesErr = null;
  }
  if(mesInf.length > 0){
    mesInf = mesInf[0];
  }else{
    mesInf = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    //csrfToken: req.csrfToken(),
    errorMessage: mesErr,
    infoMessage: mesInf,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Email/password non valida.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if(doMatch){
            if(user.superuser){
              req.session.isSuperuser = true;
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              //console.log(err);
              return res.redirect(user.superuser ? '/admin/lessons' : '/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Email/password non valida.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        name:name,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const isSuperuser = constants.SUPERUSER_MAIL.find(val => val === email);
      const user = new User({
        email: email,
        name: name,
        superuser: isSuperuser ? true : undefined,
        password: hashedPassword
      });
      return user.save();
    })
    .then(result => {

      console.log(constants.APP_URL);

      const html_content = `<h4>Astanga Firenze - Prenotazione Shala</h4>
        <p>Ti sei registrato correttamente al gestionale di prenotazione.</p>
        <p><a href="${constants.APP_URL}">Accedi al gestionale</a></p>
        <p><em>Lo staff di Astanga Firenze</em></p>`;

      req.flash('info', 'Registrazione effettuata! Adesso puoi accedere con i tuoi dati. ');
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'prenota@astangafirenze.it',
        subject: 'Astanga Firenze Prenotazioni - Regitrazione effettuata',
        html: html_content
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    //console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err){
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
      .then(user => {
        if(!user){
          req.flash('error', 'Non è stato trovato nessun utente con questa mail.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'checcobarbieri@gmail.com',
          subject: 'Password reset',
          html: `
          <p>Hai richiesto una nuova password</p>
          <p>Clicca su questo <a href="${constants.APP_URL}reset/${token}">link</a> per impostarla.</p>
          `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
      resetToken: token, 
      resetTokenExpiration: {$gt: Date.now()}
    })
    .then(user => {
      let message = req.flash('error');
      if(message.length > 0){
        message = message[0];
      }else{
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId
  })
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => console.log(err));

};