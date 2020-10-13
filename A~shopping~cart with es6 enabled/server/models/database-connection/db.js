import { connect } from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const { MONGODB_URI, MONGODB_PASSWORD } = process.env;

// console.log(MONGODB_URI, MONGODB_PASSWORD )


connect(MONGODB_URI.replace("<password>", MONGODB_PASSWORD), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
}, (err) => {
      if (!err) return console.log('MongoDB Connection Succeeded.')
      console.log('Error in DB connection : ' + err)
});

/*
      ##  ********** ##
if you want to add new products to the data base ,,
for that just uncomment the below code and add NEW products to seed/product-seeder page andrefresh the app server
      ##  ********** ##
*/

// require('../seed/product-seeder')

