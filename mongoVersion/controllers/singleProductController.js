const Product = require('../models/product');

module.exports = {

    async singleProductDekho(req, res) {
        var productId = req.params.id;
    // console.log(productId)
        Product.findById(productId, function (err, product) {
            // const successMgs = req.flash('success')[0];
            // console.log(product)
            if (err) {
                return res.redirect('/');
            }
            if (!req.user) {
                return res.render('singleproduct/SingleProductDetails', { products : product});
            }
            console.log(product)
            return res.render('singleproduct/SingleProductDetails', { products: product, user: req.user.name });
        })
    
    },

   

}