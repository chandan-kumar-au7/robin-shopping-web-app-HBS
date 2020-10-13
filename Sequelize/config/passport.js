var passport = require('passport');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;

//serialize
passport.serializeUser(function (user, done) {

    done(null, user.id);

});

// deserialize user
passport.deserializeUser(function (id, done) {

    User.findOne({
        where: {
            id: id
        }
    }).then(function (user) {

        if (user) {

            done(null, user.get());

        } else {

            done(user.errors, null);

        }

    });

});

// ================================>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<==============================\\

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password.').notEmpty().isLength({ min: 4 });

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    var generateHash = function (password) {

        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

    };

    User.findOne({
        where: {
            email: email
        }
    }).then(function (user) {

        if (user) {

            return done(null, false, {
                message: 'That email is already taken'
            });

        }
        else {
            var userPassword = generateHash(password);

            var data = {
                name: req.body.name,
                email: email,
                password: userPassword
            };

            User.create(data).then(function (newUser, created) {
                if (!newUser) {

                    return done(null, false);

                }

                if (newUser) {

                    return done(null, newUser);

                }
            })
        }
    })
}));

// ================================>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<==============================\\

//LOCAL SIGNIN
passport.use('local.signin', new LocalStrategy(

    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },

    function (req, email, password, done) {

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
        var isValidPassword = function(userpass, password) {
 
            return bCrypt.compareSync(password, userpass);
 
        }

        User.findOne({
            where: {
                email: email
            }
        }).then(function (user) {

            if (!user) {

                return done(null, false, {
                    message: 'Email does not exist'
                });

            }

            if (!isValidPassword(user.password, password)) {

                return done(null, false, {
                    message: 'Incorrect password.'
                });

            }


            var userinfo = user.get();
            return done(null, userinfo);

        }).catch(function (err) {

            console.log("Error:", err);

            return done(null, false, {
                message: 'Something went wrong with your Signin'
            });

        });

    }));

// ================================>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<==============================\\

// passport.use('local.signin', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
// }, function (req, email, password, done) {
//     req.checkBody('email', 'Invalid email').notEmpty().isEmail();
//     req.checkBody('password', 'Invalid password').notEmpty();
//     var errors = req.validationErrors();
//     if (errors) {
//         var messages = [];
//         errors.forEach(function (error) {
//             messages.push(error.msg);
//         });
//         return done(null, false, req.flash('error', messages));
//     }
//     User.findOne({
//                     where: {
//                         email: email
//                     }
//                 }, function (err, user) {
//         if(err) {
//             return done(err);
//         }
//         if(!user) {
//             return done(null, false, {message: 'No user found.'});
//         }
//         if( !user.validPassword(password)) {
//             return done(null, false, {message: 'Wrong password.'});
//         }
//         return done(null, user);
//     })
// }));