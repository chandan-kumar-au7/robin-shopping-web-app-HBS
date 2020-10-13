import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressHbs from 'express-handlebars';
import Handlebars from 'handlebars';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import validator from 'express-validator';
import flash from 'connect-flash';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import connectMongo from 'connect-mongo';
import dotenv from 'dotenv'
dotenv.config()


import index from './routes/index';
import userRoutes from './routes/user';
// import singleProduct from './routes/individualproduct';
// import searchProduct from './routes/searchproduct';

const MongoStore = connectMongo(session);
var app = express();

//dot env for sesurity purpous

// database required
import './models/database-connection/db';

//passport
import './config/passport';

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs',handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection  }),
    cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../public')));
console.log("__dirname:    ",path.join(__dirname, '../public')); 

app.use(function(req, res, next) {
   res.locals.login = req.isAuthenticated();
   res.locals.session = req.session;
   next();
});

app.use('/user', userRoutes);
app.use('/', index);
// app.use('/', singleProduct);
// app.use('/', searchProduct);

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

export default app;