// models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  flatNumber: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  addressType: {
    type: String, // e.g., 'Home', 'Work'
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Address', addressSchema);
