"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var _bcryptNodejs = require("bcrypt-nodejs");

var Schema = _mongoose.Schema;
var userSchema = new Schema({
  // sign in database 
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.methods.encryptPassword = function (password) {
  //encrypt the password means hide the password
  return (0, _bcryptNodejs.hashSync)(password, (0, _bcryptNodejs.genSaltSync)(5), null);
};

userSchema.methods.validPassword = function (password) {
  //check id the password is valid
  return (0, _bcryptNodejs.compareSync)(password, this.password);
};

var _default = (0, _mongoose.model)('User', userSchema);

exports["default"] = _default;