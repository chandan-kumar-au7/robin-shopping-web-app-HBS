const { Router } = require('express');
var router = Router();

const Product = require('../models/product');

router.get('/productdekho/:id', async (req, res) => {
    var productId = req.params.id;
// console.log(productId)
    Product.findAll({id : productId}, function (err, product) {
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

})

router.get('/getproduct/:id',async (req,res)=>{
    const keyWord = req.query.q;
    console.log(keyWord)
    try{
        if(!keyWord) throw new Error("keyword to be searched is required");
        //finding all products
        const allproducts = await Products.find();
        //custom func to search in title, category and description
        const search = (text) => allproducts.filter(product => (product.title.toLowerCase().includes(text.toLowerCase())
            || product.category.toLowerCase().includes(text.toLowerCase())
            || product.description.toLowerCase().includes(text.toLowerCase())));
        //searching mathching keyword 
        let products = search(keyWord);
        //checking if any relevant products are found
        if (products.length == 0) return res.status(404).json({ Error: `no product matching '${keyWord}' found` });
        //check if page number given
        if(req.query.page){
            products = products.slice((req.query.page - 1)*10, ((req.query.page - 1)*10)+10)
        }
        //sending success response
        res.json([{products_counts: products.length},products])
    }
    catch(err){
        console.log(err.message)
        //sending error response if any
        res.json({Error: err.message})
    }
})


module.exports = router;