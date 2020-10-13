"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _passport = _interopRequireDefault(require("passport"));

var _expressValidator = _interopRequireDefault(require("express-validator"));

var _connectFlash = _interopRequireDefault(require("connect-flash"));

var _allowPrototypeAccess = require("@handlebars/allow-prototype-access");

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _index = _interopRequireDefault(require("./routes/index"));

var _user = _interopRequireDefault(require("./routes/user"));

require("./models/database-connection/db");

require("./config/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

// import singleProduct from './routes/individualproduct';
// import searchProduct from './routes/searchproduct';
var MongoStore = (0, _connectMongo["default"])(_expressSession["default"]);
var app = (0, _express["default"])(); //dot env for sesurity purpous
// database required

// view engine setup
app.engine('.hbs', (0, _expressHandlebars["default"])({
  defaultLayout: 'layout',
  extname: '.hbs',
  handlebars: (0, _allowPrototypeAccess.allowInsecurePrototypeAccess)(_handlebars["default"])
}));
app.set('view engine', '.hbs'); // uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use((0, _expressValidator["default"])());
app.use((0, _cookieParser["default"])());
app.use((0, _expressSession["default"])({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: _mongoose["default"].connection
  }),
  cookie: {
    maxAge: 180 * 60 * 1000
  }
}));
app.use((0, _connectFlash["default"])());
app.use(_passport["default"].initialize());
app.use(_passport["default"].session());
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../public')));
console.log("__dirname:    ", _path["default"].join(__dirname, '../public'));
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
app.use('/user', _user["default"]);
app.use('/', _index["default"]); // app.use('/', singleProduct);
// app.use('/', searchProduct);
// catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
var _default = app;
exports["default"] = _default;