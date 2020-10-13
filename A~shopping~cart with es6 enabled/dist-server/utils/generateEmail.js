"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMailToUser = sendMailToUser;

var _nodemailer = require("nodemailer");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var transportOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'chandankr.pra930@gmail.com',
    pass: '9110130860rt'
  }
};
var mailTransport = (0, _nodemailer.createTransport)(transportOptions);

function sendMailToUser(_x, _x2, _x3, _x4) {
  return _sendMailToUser.apply(this, arguments);
}

function _sendMailToUser() {
  _sendMailToUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(email, status, amount, payment_id) {
    var TotalAmount, html;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            TotalAmount = amount / 100;
            html = null;

            if (status === "success") {
              html = "\n      <center>\n    <h1>Welcome to A~SHOPPING~CART </h1>\n    <h3>Order Placed Successfully</h1>\n    <h5>Thanks for Shopping with us. </h5>\n    <h6>order_value  :  ".concat(TotalAmount, "</h6>\n    <h6>stripe_payment_id  :  ").concat(payment_id, "</h6>\n    <h6>We received your ORDER</h6>\n    Thanks For Shoppping With Us\n    </center> \n      ");
            } else if (status === "fail") html = "\n      <h1>Welcome to A~SHOPPING~CART </h1>\n      <h5>Thanks for Shopping with us. </h5>\n      Soory to  say that something is wrong in your payment\n      your payment is autoreversed from our side\n      it will take 3-5 buisness days to refund in your account ";

            _context.prev = 3;
            _context.next = 6;
            return mailTransport.sendMail({
              from: process.env.EMAIL,
              to: email,
              subject: "Order Details from A~SHOPPING~CART",
              html: html
            });

          case 6:
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](3);
            console.log(_context.t0);
            throw _context.t0;

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 8]]);
  }));
  return _sendMailToUser.apply(this, arguments);
}