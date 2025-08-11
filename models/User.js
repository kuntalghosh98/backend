// // models/User.js
// const mongoose = require('mongoose');

// const otpSchema = new mongoose.Schema({
//   otp: { type: String },
//   expiry: { type: Date },
// }, { _id: false });

// const userSchema = new mongoose.Schema({
//   googleId: {
//     type: String,
//     unique: true,
//     sparse: true,
//   },
//   name: {
//     type: String,
//     trim: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//     sparse: true,
//     lowercase: true,
//     trim: true,
//   },
//   emailOTP: otpSchema,
//   mobile: {
//     type: String,
//     unique: true,
//     sparse: true,
//   },
//   mobileOTP: otpSchema,
//   password: {
//     type: String,
//     minlength: 6,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);




const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: { type: String },
  expiry: { type: Date },
}, { _id: false });

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  emailOTP: otpSchema,
  mobile: {
    type: String,
    unique: true,
    sparse: true,
  },
  mobileOTP: otpSchema,
  password: {
    type: String,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
