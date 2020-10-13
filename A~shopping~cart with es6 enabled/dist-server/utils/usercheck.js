"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLoggedIn = isLoggedIn;
exports.isLoggedInForUserjsfile = isLoggedInForUserjsfile;
exports.notLoggedIn = notLoggedIn;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

function isLoggedInForUserjsfile(req, res, next) {
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