// models/ProductScrollList.js
const mongoose = require('mongoose');

const ProductScrollListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  listNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
}, { timestamps: true });

ProductScrollListSchema.path('productIds').validate(function (val) {
  return val.length <= 20;
}, 'Product list cannot exceed 20 items');

module.exports = mongoose.model('ProductScrollList', ProductScrollListSchema);
