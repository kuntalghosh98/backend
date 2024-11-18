
// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer'); // For sending OTP via email

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};

const sendOTPEmail = async (email, otp) => {
  // Setup nodemailer to send OTP via email (Example)
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px; background-color: #f9f9f9;">
    <h2 style="color: #333;">OTP Verification</h2>
    <p style="font-size: 16px; color: #666;">Your OTP for verification is:</p>
    <div style="padding: 10px; background-color: #e0e0e0; text-align: center; border-radius: 5px; margin: 20px 0;">
      <span style="font-size: 24px; font-weight: bold;">${otp}</span>
    </div>
    <p style="font-size: 14px; color: #999;">If you did not request this OTP, please ignore this email.</p>
  </div>
`;

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'www.kg420@gmail.com',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP for verification is ${otp}`,
    html:htmlContent
  });

  console.log('Message sent: %s', info.messageId);
};

exports.requestEmailOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = generateOTP();
    console.log(otp);
    console.log(email);
    const user = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            'emailOTP.otp': otp,
            'emailOTP.expiry': new Date(Date.now() + 600000), // OTP expires in 10 minutes (600000 ms)
          },
        },
        {
          new: true, // Return updated document
          upsert: true, // Create a new document if email doesn't exist
          setDefaultsOnInsert: true, // Required when upsert is true
        }
    );
    console.log(user);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({ msg: 'OTP sent to email' });

  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;
console.log(email,otp)
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.emailOTP.otp !== otp || user.emailOTP.expiry < new Date()) {
      return res.status(400).json({ msg: 'Invalid OTP or OTP expired' });
    }

    // Clear OTP and expiry after successful verification
    user.emailOTP.otp = undefined;
    user.emailOTP.expiry = undefined;
    await user.save();

    // You can generate a JWT token and send it back to the client for authenticated sessions
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, user });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Similar functions can be implemented for mobile OTP
