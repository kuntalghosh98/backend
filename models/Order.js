// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   orderId: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   payment: {
//     razorpayPaymentId: String,
//     razorpayOrderId: String,
//     razorpaySignature: String,
//     amount: Number,
//     createdAt:Number,
//     currency:String,
//     receipt:String,
//     status: {
//       type: String,
//       enum: ['pending', 'completed', 'failed'],
//       default: 'pending',
//     },
//   },
//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//       quantity: { type: Number, required: true },
//       size: { type: String, required: true },
//       variantColor: { type: String, required: true },
//       deliveryStatus: {
//         type: String,
//         enum: ['pending', 'shipped', 'delivered', 'cancelled'],
//         default: 'pending',
//       },
//     },
//   ],
//   address: {
//     name: String,
//     mobileNumber: String,
//     pincode: String,
//     locality: String,
//     flatNumber: String,
//     landmark: String,
//     district: String,
//     state: String,
//     addressType: String,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Order', orderSchema);






















const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payment: {
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    amount: Number,
    createdAt: Number,
    currency: String,
    receipt: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      size: { type: String },
      variantColor: { type: String },
      price: { type: Number, required: true },               // Item price
      appliedDiscount: { type: Number, default: 0 },         // Discount applied on item
      deliveryStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
      },
      return: {
        applicable: { type: Boolean, default: false },       // True if item is returnable
        initiated: { type: Boolean, default: false },        // True if return has been initiated
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
