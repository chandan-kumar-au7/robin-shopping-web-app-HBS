const nodemailer = require("nodemailer");
const { getMaxListeners } = require("../models/user");
const transportOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  // debug: process.env.NODE_ENV === "development",
  auth: {
    user: 'chandankr.pra930@gmail.com',
    pass: '9110130860rt'
  }
};

const mailTransport = nodemailer.createTransport(transportOptions);

const sendMailToUser = async (email, status, amount, payment_id, order_id) => {
  let html = null;
  if (status === "success")
    html = `
  <h1>Welcome to A~SHOPPING~CART </h1>
  <h3>Order Placed Successfully</h1>
  <h5>Thanks for Shopping with us. </h5>
  <h6>order_value  :  ${amount}</h6>
  <h6>stripe_payment_id  :  ${payment_id}</h6>
  <h6>We received your ORDER</h6>
  Thanks For Shoppping With Us 
    `;
  else if (status === "fail")
    html = `
    <h1>Welcome to A~SHOPPING~CART </h1>
    <h5>Thanks for Shopping with us. </h5>
    Soory to  say that something is wrong in your payment
    your payment is autoreversed from our side
    it will take 3-5 buisness days to refund in your account `;
  try {
    await mailTransport.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Order Details from A~SHOPPING~CART",
      html
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};


module.exports = {
  async sendMailToUser(email, status, amount, payment_id) {
    let html = null;
    if (status === "success")
      html = `
    <h1>Welcome to A~SHOPPING~CART </h1>
    <h3>Order Placed Successfully</h1>
    <h5>Thanks for Shopping with us. </h5>
    <h6>order_value  :  ${amount}</h6>
    <h6>stripe_payment_id  :  ${payment_id}</h6>
    <h6>We received your ORDER</h6>
    Thanks For Shoppping With Us 
      `;
    else if (status === "fail")
      html = `
      <h1>Welcome to A~SHOPPING~CART </h1>
      <h5>Thanks for Shopping with us. </h5>
      Soory to  say that something is wrong in your payment
      your payment is autoreversed from our side
      it will take 3-5 buisness days to refund in your account `;
    try {
      await mailTransport.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Order Details from A~SHOPPING~CART",
        html
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  
  async sendOrderStatus(email, status) {
    let html = null;
    if (status === "accepted")
      html = `
    <h1>Welcome to A~SHOPPING~CART </h1>
    <h3>Your Order accepted by A~SHOPPING~CART</h1>
    <h5>Thanks for Shopping with us. order will be delivered in 4-5 BUSINESS DAYS </h5>
    Thanks For Shoppping With Us 
      `;
    else if (status === "rejected")
      html = `
      <h1>Welcome to A~SHOPPING~CART </h1>
      <h5>Thanks for Shopping with us. </h5>
      Soory to  say that due to unavialibility of items 
      or due to some technical problem we can't accept your order 
      your payment is autoreversed from our side
      it will take 3-5 buisness days to refund in your account `;
    try {
      await mailTransport.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Order Details from A~SHOPPING~CART",
        html
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}