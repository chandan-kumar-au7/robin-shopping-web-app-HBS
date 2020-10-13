var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');
const {
    sendMailToUser
} = require("../utils/generateEmail");


const productChunks = [];


/* GET home page. */
router.get('/', async (req, res) => {
    const successMgs = req.flash('success')[0];
    var PRODUCTS = await Product.findAll()
    // console.log(PRODUCTS)
    // console.log("docs")
    const chunkSize = 3;
    for (let i = 0; i < PRODUCTS.length; i += chunkSize) {
        productChunks.push(PRODUCTS.slice(i, i + chunkSize));
    }
    console.log(productChunks)
    // console.log(req.session)
    if (!req.user) {
        return res.render('shop/allproducts', { title: 'Shopping cart', products: productChunks, successMgs: successMgs, noMessage: !successMgs });
    }
    return res.render('shop/allproducts', { title: 'Shopping cart', user: req.user.name, products: productChunks, successMgs: successMgs, noMessage: !successMgs });
});


router.get('/add', async function (req, res) {//this id is that id which every product gets when it  get stored in database
    
    console.log(req.session)
    var productId = req.params.id;
    
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    console.log(productId)
    console.log(cart)


    const PRODUCT = await Product.findOne({ where: { id: productId } })
    if ( PRODUCT === null) {
            return res.redirect('/');
        }
        console.log(PRODUCT)
        console.log(cart)
        cart.add(product, PRODUCT.id);
        req.session.cart = cart;
        // z(req.session.cart);
        res.redirect('/');

})

router.get('/increase/:id', function (req, res, next) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.increasebyOne(productId);
    req.session.cart = cart;
    res.redirect('/shoppingcart');
});


router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shoppingcart');
});

router.get('/remove/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shoppingcart');
});

router.get('/shoppingcart', function (req, res, next) {
    // console.log(req.user)
    if (!req.session.cart) {
        return res.render('shop/shoppingcart', { products: null });
    } if (!req.user) {
        var cart = new Cart(req.session.cart);
        return res.render('shop/shoppingcart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
    }
    var cart = new Cart(req.session.cart);
    console.log(cart.generateArray().length)
    return res.render('shop/shoppingcart', { successMgs: cart.generateArray().length, products: cart.generateArray(), totalPrice: cart.totalPrice, user: req.user.name });

});



router.get('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingcart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    return res.render('shop/checkout', { user: req.user.name, total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
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
        const amount = cart.totalPrice * 100
        order.save(function (err, result) {
            // console.log(err)
            // console.log(result)
            if (err) {
                req.flash('error', err.message);
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