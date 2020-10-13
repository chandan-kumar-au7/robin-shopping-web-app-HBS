"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var Schema = _mongoose.Schema;
var schema = new Schema({
  //schema of oredered item
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cart: {
    type: Object,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  contactno1: {
    type: Number,
    required: true,
    min: 10
  },
  contactno2: {
    type: Number,
    required: true,
    min: 10
  },
  city: {
    type: String,
    required: true,
    min: 3
  },
  state: {
    type: String,
    required: true,
    min: 3
  },
  pin: {
    type: Number,
    required: true,
    min: 6
  },
  paymentId: {
    type: String,
    required: true
  }
});

var _default = (0, _mongoose.model)('Order', schema);

exports["default"] = _default;