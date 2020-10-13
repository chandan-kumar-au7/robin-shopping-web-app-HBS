"use strict";

var _mongoose = require("mongoose");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var _process$env = process.env,
    MONGODB_URI = _process$env.MONGODB_URI,
    MONGODB_PASSWORD = _process$env.MONGODB_PASSWORD; // console.log(MONGODB_URI, MONGODB_PASSWORD )

(0, _mongoose.connect)(MONGODB_URI.replace("<password>", MONGODB_PASSWORD), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, function (err) {
  if (!err) return console.log('MongoDB Connection Succeeded.');
  console.log('Error in DB connection : ' + err);
});
/*
      ##  ********** ##
if you want to add new products to the data base ,,
for that just uncomment the below code and add NEW products to seed/product-seeder page andrefresh the app server
      ##  ********** ##
*/
// require('../seed/product-seeder')