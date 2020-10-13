var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
const Handlebars = require('handlebars')
var mongoose = require('mongoose');
var session  = require('express-session');
var passport = require('passport');
var validator = require('express-validator');
var flash = require('connect-flash');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var MongoStore = require('connect-mongo')(session);
const dotenv = require("dotenv");

var index = require('./routes/index');
var userRoutes = require('./routes/user');
var singleProduct = require('./routes/singleproduct');
var searchProduct = require('./routes/searchproduct');

var app = express();

//dot env for sesurity purpous
dotenv.config();

// database required
require('./models/database-connection/db')

//passport
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs',handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
   res.locals.login = req.isAuthenticated();
   res.locals.session = req.session;
   next();
});

app.use('/', index);
<<<<<<< HEAD
app.use('/user', userRoutes);
=======
>>>>>>> c29a638b63ba9635f2312076598a76e94430a4af
app.use('/', singleProduct);
app.use('/', searchProduct);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;