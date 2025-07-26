const nodemailer = require('nodemailer');

 let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

exports.sendPaymentSuccessEmail = async (to, orderId, amount) => {
  const mailOptions = {
    from: `"Aurius" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Your Aurius Order is Confirmed',
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your payment was successful.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Amount Paid:</strong> ₹${(amount / 100).toFixed(2)}</p>
      <p>We’ll notify you when your order ships. Feel free to contact support if you have questions.</p>
      <br />
      <p style="color: #999;">Aurius</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
