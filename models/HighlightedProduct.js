// models/HighlightedProduct.js
const mongoose = require('mongoose');

const highlightedProductSchema = new mongoose.Schema({
  productNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
}, { timestamps: true });

highlightedProductSchema.pre('save', function (next) {
  if (this.products.length > 4) {
    return next(new Error('Cannot exceed 4 products in highlighted list.'));
  }
  next();
});

module.exports = mongoose.model('HighlightedProduct', highlightedProductSchema);
