// // models/Order.js
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   orderId: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   payment: {
//     razorpayPaymentId: String,
//     razorpayOrderId: String,
//     razorpaySignature: String,
//     amount: Number,
//     createdAt: Number,
//     currency: String,
//     receipt: String,
//     status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
//   },
//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//       quantity: { type: Number, required: true },
//       size: String,
//       variantColor: String,
//       price: { type: Number, required: true },
//       appliedDiscount: { type: Number, default: 0 },
//       deliveryStatus: {
//         type: String,
//         enum: ['pending', 'shipped', 'delivered', 'cancelled'],
//         default: 'pending',
//       },
//       return: {
//         applicable: { type: Boolean, default: false },
//         initiated: { type: Boolean, default: false },
//         status: {
//           type: String,
//           enum: ['initiated', 'accepted', 'collected'],
//           default: 'initiated',
//         },
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
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Order', orderSchema);





// models/Order.js
const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  initiated: { type: Boolean, default: false },
  reason: String,
  status: { 
    type: String, 
    enum: [
      'requested',   // customer initiated
      'approved',    // admin approved
      'rejected',    // admin rejected
      'pickup_scheduled',
      'picked',
      'in_transit',
      'delivered',   // returned item delivered to warehouse
      'refunded',    // refund completed
      'exchanged'    // replacement sent
    ],
    default: 'requested'
  },
  timeline: [
    {
      status: { type: String },
      note: String, // optional: "Approved by admin" etc.
      changedAt: { type: Date, default: Date.now }
    }
  ],
  refund: {
    amount: Number,
    refundId: String,  // Razorpay refund_id or reference
    refundedAt: Date,
  }
}, { _id: false });


const cancellationSchema = new mongoose.Schema({
  initiated: { type: Boolean, default: false },
  cancelledBy: { type: String, enum: ['user', 'admin'] },
  status: { type: String, enum: ['requested', 'confirmed', 'rejected'], default: 'requested' },
  cancelledAt: Date,
  refund: {
    amount: Number,
    refundId: String,
    refundedAt: Date,
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userId', required: true },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      size: String,
      variantColor: String,
      price: Number,

      cancellation: cancellationSchema,
      return: returnSchema
    }
  ],

  shipments: [
    {
      items: [{ type: mongoose.Schema.Types.ObjectId }], // link to order.items._id
      type: { type: String, enum: ['manual', 'shiprocket'], required: true },
      courierName: String,
      trackingId: String,
      trackingUrl: String,
      status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
      timeline: [
        {
          status: String,
          changedAt: { type: Date, default: Date.now }
        }
      ]
    }
  ],

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

  status: { type: String, default: 'placed' } // overall order status
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
