const Product = require('../models/product');


module.exports = {

    async searchbykey(req, res) {
        const productChunks = [];

        const searchbykey = (req.query.dsearch);

        const lowerSEARCHKEY = searchbykey.toLowerCase();
        try {
            Product.find({
                $or: [{ title: { $regex: '.*' + lowerSEARCHKEY + '.*' } },
                { description: { $regex: '.*' + lowerSEARCHKEY + '.*' } }]
            }, (err, searchDATA) => {
                if (err) {
                    console.log("FROM LINE 66 \n")
                } if (!searchDATA) {
                    console.log("FROM LINE 68 \n")
                    console.log('No product related to ' + searchbykey + "\n")
                    res.render('searchproduct/notfoundpage')
                } else {
                    console.log(searchDATA)
                    console.log(" FROM LINE 73")
                    const chunkSize = 3;
                    for (let i = 0; i < searchDATA.length; i += chunkSize) {
                        productChunks.push(searchDATA.slice(i, i + chunkSize));
                    }
                    if (productChunks.length == 0) {
                        return res.render('searchproduct/notfoundpage', { successMgs: searchDATA.length, products: productChunks })
                    }
                    res.render('searchproduct/searchresultpage'
                        , { successMgs: searchDATA.length, products: productChunks }
                    )

                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}