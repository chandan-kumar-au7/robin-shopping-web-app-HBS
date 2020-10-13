"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var Schema = _mongoose.Schema;
var schema = new Schema({
  //schema of item displayed on fron page
  imagePath: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

var _default = (0, _mongoose.model)('Product', schema); //accessing a model


exports["default"] = _default;