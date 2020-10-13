<<<<<<< HEAD
const  Router  = require('express');
var router = Router();

const { searchbykey } = require('../controllers/searchProductController')
=======
const { Router } = require('express');
var router = Router();

const Product = require('../models/product');
>>>>>>> c29a638b63ba9635f2312076598a76e94430a4af

//===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>

<<<<<<< HEAD
router.get('/searchbykey',searchbykey);
=======
router.get('/searchbykey', (req, res) => {
    const productChunks = [];

    const searchbykey = (req.query.dsearch);

    const lowerSEARCHKEY = searchbykey.toLowerCase();
    const SPLITlowerSEARCHKEY = lowerSEARCHKEY.split();

    const upperSEARCHKEY = searchbykey.toUpperCase();
    const SPLITupperSEARCHKEY = upperSEARCHKEY.split();

    for (var i = 0; i < SPLITlowerSEARCHKEY.length; i++) {
        SPLITlowerSEARCHKEY[i] = SPLITlowerSEARCHKEY[i].charAt(0).toUpperCase() + SPLITlowerSEARCHKEY[i].slice(1);
        const joinSPLITlowerSEARCHKEY = SPLITlowerSEARCHKEY.join(' ', '-');

        for (var i = 0; i < SPLITupperSEARCHKEY.length; i++) {
            SPLITupperSEARCHKEY[i] = SPLITupperSEARCHKEY[i].charAt(0).toLowerCase() + SPLITupperSEARCHKEY[i].slice(1);
            const joinSPLITupperSEARCHKEY = SPLITupperSEARCHKEY.join(' ', '-');

            //===================================================>>>>>>>>>>>>>>>
            //==================================>>>>>>>>>>>>>>>

            console.log(" USER GIVEN " + searchbykey + "\n")

            console.log(" LOWER VALUE " + lowerSEARCHKEY + "\n")
            console.log(" SPLIT LOWER VALUE " + SPLITlowerSEARCHKEY + "\n")
            console.log(" JOIN SPLIT LOWER VALUE " + joinSPLITlowerSEARCHKEY + "\n")

            console.log(" UPPER VALUE " + upperSEARCHKEY + "\n")
            console.log(" SPLIT UPPER VALUE " + SPLITupperSEARCHKEY + "\n")
            console.log(" JOIN SPLIT UPPER VALUE " + joinSPLITupperSEARCHKEY + "\n")

            //===================================================>>>>>>>>>>>>>>>
            //==================================>>>>>>>>>>>>>>>


            try {
                Product.find({
                    $or: [{ title: { '$regex': searchbykey || lowerSEARCHKEY || joinSPLITlowerSEARCHKEY || upperSEARCHKEY || joinSPLITupperSEARCHKEY } },
                    { description: { '$regex': searchbykey || lowerSEARCHKEY || joinSPLITlowerSEARCHKEY || upperSEARCHKEY || joinSPLITupperSEARCHKEY } }]
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
});
>>>>>>> c29a638b63ba9635f2312076598a76e94430a4af

//===================================================>>>>>>>>>>>>>>>
//==================================>>>>>>>>>>>>>>>
module.exports = router;