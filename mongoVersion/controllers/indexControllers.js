var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

const {
    sendMailToUser,
} = require("../utils/generateEmail");

//===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>
//just finding product globally from the database for creating a chunk value

const productChunks = [];
Product.find((err, docs) => {
    const chunkSize = 3;
    for (let i = 0; i < docs.length; i += chunkSize) {
        productChunks.push(docs.slice(i, i + chunkSize));
    }
})

module.exports = {

    //===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>
    // controller for all product in home page

    async allProduct(req, res) {
        const successMgs = req.flash('success')[0];
        // console.log(req.session)
        if (!req.user) {
            return res.render('shop/allproducts', { title: 'Shopping cart', products: productChunks, successMgs: successMgs, noMessage: !successMgs });
        }
        return res.render('shop/allproducts', { title: 'Shopping cart', user: req.user.name, products: productChunks, successMgs: successMgs, noMessage: !successMgs });
    },

    //===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>
    // controller for add to cart

    async addToCart(req, res) {//this id is that id which every product gets when it  get stored in database
        var productId = req.params.id;//if cart is non empty then return that else return empty {}
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        Product.findById(productId, function (err, product) {
            if (err) {
                return res.redirect('/');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            // (req.session.cart);
            res.redirect('/');
        })
    },


    //===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>
    // CONTROLLER for increase cart value and price by id 
    
    async increaseCartValue(req, res, next) {
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.increasebyOne(productId);
        req.session.cart = cart;
        res.redirect('/shoppingcart');
    },
    
// CONTROLLER for DECREASING  cart value and price by id 

//===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>

    async decreaseCartValue(req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.reduceByOne(productId);
        req.session.cart = cart;
        res.redirect('/shoppingcart');
    },

    //===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>
    //  remove all product of SAME type from the cart

async removeCartItem(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shoppingcart');
},

//===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>
//  shopping cart controller

async shoppingCart(req, res, next) {
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
    
},

//===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>
// get req handeler for checkout request

async checkoutAsGet(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingcart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    return res.render('shop/checkout', { user: req.user.name,total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
},

//===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>
// POST request for checkout request 

async  checkoutAsPost(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingcart');
    }
    var cart = new Cart(req.session.cart);

////////////////================>>>>>>>>>>>>>>>>>>>>>>
//payment here itself

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
}

//===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>

};