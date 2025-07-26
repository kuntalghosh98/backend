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
  landmark: String,
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  addressType: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);

