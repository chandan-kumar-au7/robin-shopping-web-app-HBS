"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _csurf = _interopRequireDefault(require("csurf"));

var _passport = _interopRequireDefault(require("passport"));

require("../config/passport");

var _order = require("../models/order");

var _cart = _interopRequireDefault(require("../models/cart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();
var csrfProtection = (0, _csurf["default"])();
router.use(csrfProtection);
router.get('/profile', isLoggedIn, function (req, res, next) {
  (0, _order.find)({
    user: req.user
  }, function (err, orders) {
    if (err) {
      return res.write('Error!');
    }

    if (!req.user) {
      return res.render('user/profile', {
        orders: orders
      });
    }

    var cart;
    orders.forEach(function (order) {
      cart = new _cart["default"](order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {
      orders: orders,
      user: req.user.name
    });
  });
}); //so when we are signed in then 2 options come logout and profile... which only needs to be checked for log in 
// so particularly in that 2 functions we have written isloggedin

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});
router.use('/', notLoggedIn, function (req, res, next) {
  //this function is written here because it checks that if user is 
  //logged in or not  ....if not logged in then further functions should get executed so to check for all '/xxx'
  //it is used before these functions
  next();
});
router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});
router.post('/signup', _passport["default"].authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});
router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});
router.post('/signin', _passport["default"].authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/');
  }
});
var _default = router; //below code is for protecting some routes so that they only execute when we are logged in

exports["default"] = _default;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/'); //redirect to starting page when logged in 
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}