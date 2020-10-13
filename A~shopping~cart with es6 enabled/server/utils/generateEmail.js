import { createTransport } from "nodemailer";
const transportOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'chandankr.pra930@gmail.com',
    pass: '9110130860rt'
  }
};

const mailTransport = createTransport(transportOptions);
export async function sendMailToUser(email, status, amount, payment_id) {
  const TotalAmount = amount / 100;
  let html = null;
  if (status === "success") {
    html = `
      <center>
    <h1>Welcome to A~SHOPPING~CART </h1>
    <h3>Order Placed Successfully</h1>
    <h5>Thanks for Shopping with us. </h5>
    <h6>order_value  :  ${TotalAmount}</h6>
    <h6>stripe_payment_id  :  ${payment_id}</h6>
    <h6>We received your ORDER</h6>
    Thanks For Shoppping With Us
    </center> 
      `;
  }
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
  }
  catch (err) {
    console.log(err);
    throw err;
  }
}
