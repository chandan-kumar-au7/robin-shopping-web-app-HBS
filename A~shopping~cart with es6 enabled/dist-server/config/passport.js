"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _user = _interopRequireDefault(require("../models/user"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_passport["default"].serializeUser(function (user, done) {
  done(null, user.id);
});

_passport["default"].deserializeUser(function (id, done) {
  _user["default"].findById(id, function (err, user) {
    done(err, user);
  });
});

_passport["default"].use('local.signup', new _passportLocal["default"]({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password.').notEmpty().isLength({
    min: 4
  });
  var errors = req.validationErrors();

  if (errors) {
    var messages = [];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  _user["default"].findOne({
    'email': email
  }, function (err, user) {
    if (err) {
      return done(err);
    }

    if (user) {
      return done(null, false, {
        message: 'Email is already in use.'
      });
    }

    var newUser = new _user["default"]();
    newUser.name = req.body.name;
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function (err, result) {
      if (err) {
        console.log(result);
        return done(err);
      }

      return done(null, newUser);
    });
  });
}));

_passport["default"].use('local.signin', new _passportLocal["default"]({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    var messages = [];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  _user["default"].findOne({
    'email': email
  }, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, {
        message: 'No user found.'
      });
    }

    if (!user.validPassword(password)) {
      return done(null, false, {
        message: 'Wrong password.'
      });
    }

    return done(null, user);
  });
}));