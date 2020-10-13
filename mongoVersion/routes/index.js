const { Router } = require('express');
var router = Router();

<<<<<<< HEAD
const {isLoggedIn} = require('../utils/usercheck')
=======
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');
const {
    sendMailToUser,
    sendOrderStatus
  } = require("../utils/generateEmail");
  
>>>>>>> c29a638b63ba9635f2312076598a76e94430a4af

const { allProduct, addToCart, increaseCartValue,decreaseCartValue, removeCartItem , shoppingCart, checkoutAsGet , checkoutAsPost} = require("../controllers/indexControllers");

/*  // route for all product in home page. */
router.get('/', allProduct);

router.get('/add-to-cart/:id',addToCart);

router.get('/increase/:id',increaseCartValue);

router.get('/reduce/:id',decreaseCartValue);

router.get('/remove/:id',removeCartItem);

router.get('/shoppingcart', shoppingCart);

router.get('/checkout', isLoggedIn, checkoutAsGet);

router.post('/checkout', isLoggedIn,checkoutAsPost);

<<<<<<< HEAD
module.exports = router;
=======
router.get('/shoppingcart', function (req, res, next) {
    // console.log(req.user)
    if (!req.session.cart) {
        return res.render('shop/shoppingcart', { products: null });
    }if (!req.user){
        var cart = new Cart(req.session.cart);
        return res.render('shop/shoppingcart', { products: cart.generateArray(), totalPrice: cart.totalPrice});
    }
    var cart = new Cart(req.session.cart);
    console.log(cart.generateArray().length)
    return res.render('shop/shoppingcart', { successMgs:cart.generateArray().length,products: cart.generateArray(), totalPrice: cart.totalPrice, user: req.user.name });
    
});



router.get('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingcart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    return res.render('shop/checkout', { user: req.user.name,total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingcart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_pVJhFSD0tie3QmfWqzusM6ib"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "INR",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function (err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            contactno1: Number(req.body.contactno1),
            contactno2: Number(req.body.contactno2),
            city: req.body.city,
            state: req.body.state,
            pin: Number(req.body.pin),
            paymentId: charge.id
        });
        // console.log(order)
        const amount= cart.totalPrice * 100
        order.save(function (err, result) {
            // console.log(err)
            // console.log(result)
            if (err) {
                req.flash('error', err.message );
               return res.redirect('/checkout')
            }

            sendMailToUser(req.user.email, 'success', amount, charge.id);
            req.flash('success', 'Successfully bought product! you will receive a email shortle with your order details...');
            req.session.cart = null;
            res.redirect('/')
        });
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
>>>>>>> c29a638b63ba9635f2312076598a76e94430a4af
