var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

const {profile , logout , notLoggedInFunc, signupfunc , signUpByPassportFunc, getLoginReq, PostSignInPostReq } = require('../controllers/userController')
const { isLoggedInForUserjsfile, notLoggedIn } = require('../utils/usercheck')

var csrfProtection = csrf();

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

router.use(csrfProtection);

router.get('/profile', isLoggedInForUserjsfile, profile);

router.get('/logout', isLoggedInForUserjsfile, logout);

router.use('/', notLoggedIn,notLoggedInFunc);

router.get('/signup',signupfunc);

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}),  signUpByPassportFunc );

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

router.get('/signin',getLoginReq );

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), PostSignInPostReq );

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

module.exports = router;