const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

const constants = require('./util/constants');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

/**
 * DB STORE
 * this package (connect-mongodb-session) is for
 * storing sessions info in the DB
 * passing this to the store prop on session
 */
 const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
  });

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const frontRoutes = require('./routes/front');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/** 
 * Set the sessions properties
 * secret > the secret hash to encrypt the SESSION_ID
 * resave > set if save the session every load 
 * ...
 */
 app.use(session({
    secret: 'my secret', 
    resave: false,
    saveUninitialized: false,
    store: store
    //cookie: {expires}
  }));
  
/**
 * CSRF package
 * protect from CSRF attacks 
 */
const csurfProtection = csurf({});
app.use(csurfProtection);

/**
 * FLASH package
 * store flash (temporary) messages in sessions
 */
app.use(flash());

// app.use(errorController.get404);

app.use((req, res, next) => {
    if (!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
        req.user = user;
        next();
        })
        .catch(err => console.log(err));
});

/** 
 * RES.LOCALS
 * setting local variables to all views
 */
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    if(req.session.isLoggedIn){
        res.locals.userId = req.session.user._id;
        res.locals.userName = req.session.user.name;
    }
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(frontRoutes);
app.use(authRoutes);

mongoose.connect(constants.MONGODB_URI)
.then( result => {
    console.log('connected');
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});