// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payment: {
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    amount: Number,
    createdAt: Number,
    currency: String,
    receipt: String,
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      size: String,
      variantColor: String,
      price: { type: Number, required: true },
      appliedDiscount: { type: Number, default: 0 },
      deliveryStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
      },
      return: {
        applicable: { type: Boolean, default: false },
        initiated: { type: Boolean, default: false },
        status: {
          type: String,
          enum: ['initiated', 'accepted', 'collected'],
          default: 'initiated',
        },
      },
    },
  ],
  address: {
    name: String,
    mobileNumber: String,
    pincode: String,
    locality: String,
    flatNumber: String,
    landmark: String,
    district: String,
    state: String,
    addressType: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

