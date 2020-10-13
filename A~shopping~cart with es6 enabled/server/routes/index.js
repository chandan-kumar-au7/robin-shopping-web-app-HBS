import express from 'express';
var router = express.Router();

import Product from '../models/product';
import Cart from '../models/cart';
import Order from '../models/order';

router.get('/', function(req, res) {
    var successMgs = req.flash('success')[0];
    Product.find(function(err, docs){ 
        var productChunks = [];
        var chunkSize = 3;//in 1 row 3 items
        for (var i = 0; i < docs.length; i += chunkSize) {
          productChunks.push(docs.slice(i, i  + chunkSize));
        }
 
        if (!req.user) {
            return res.render('shop/allproducts', { title: 'Shopping cart', products: productChunks, successMgs: successMgs, noMessage: !successMgs });
        }
        return res.render('shop/allproducts', { title: 'Shopping cart', user: req.user.name, products: productChunks, successMgs: successMgs, noMessage: !successMgs });
    
    });
});

router.get('/add-to-cart/:id', function (req, res) {//this id is that id which every product gets when it  get stored in database
    var productId = req.params.id;//if cart is non empty then return that else return empty {}
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        // z(req.session.cart);
        res.redirect('/');
    })
});

router.get('/increase/:id', function (req, res) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.increasebyOne(productId);
    req.session.cart = cart;
    res.redirect('/shoppingcart');
});


router.get('/reduce/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shoppingcart');
});

router.get('/remove/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shoppingcart');
});

router.get('/shoppingcart', function (req, res) {
    // console.log(req.user)
    if (!req.session.cart) {
        return res.render('shop/shoppingcart', { products: null });
    }if (!req.user){
        var cart = new Cart(req.session.cart);
        return res.render('shop/shoppingcart', { products: cart.generateArray(), totalPrice: cart.totalPrice});
    }
    var cart = new Cart(req.session.cart);
    return res.render('shop/shoppingcart', { products: cart.generateArray(), totalPrice: cart.totalPrice, user: req.user.name });
    
});



router.get('/checkout', isLoggedIn, function (req, res) {
    if (!req.session.cart) {
        return res.redirect('/shoppingcart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    return res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});

router.post('/checkout', isLoggedIn, function (req, res) {
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
        console.log(order)
        order.save(function (err, result) {
            console.log(err)
            console.log(result)
            if (err) {
                req.flash('error', err.message );
               return res.redirect('/checkout')
            }

            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/')
        });
    });
});

export default router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}