var Order = require ('../models/order');
var Cart = require ('../models/cart');

module.exports = {

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

    async profile(req, res, next) {
        Order.find({user: req.user}, function(err, orders) {
            if(err) {
                return res.write('Error!');
            }
            if(!req.user){
                return res.render('user/profile', { orders: orders });
            }
            var cart;
            orders.forEach(function (order) {
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render('user/profile', { orders: orders, user: req.user.name });
        });
    },

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

    async logout(req, res, next) {
        req.logout();
        res.redirect('/');
    },

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

    async notLoggedInFunc(req, res, next) {
        next();
    },

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

    async signupfunc(req, res, next) {
        var messages = req.flash('error');
        res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
    },

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

    async signUpByPassportFunc(req, res, next) {
        if(req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        } else {
            res.redirect('/user/profile');
        }
    },

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

    async getLoginReq(req, res, next) {
        var messages = req.flash('error');
        res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
    },

//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\

    async PostSignInPostReq(req, res, next) {
        if(req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        } else {
            res.redirect('/');
        }
    }
    
//====================>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<=================\\


};