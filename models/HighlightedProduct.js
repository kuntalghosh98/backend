// models/HighlightedProduct.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const highlightedProductSchema = new Schema({
  productNumber: {
    type: Number,
    required: true,
    unique: true, // Ensures each product number is unique
  },
  image: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

// Enforce a maximum of 4 product IDs in the products array
highlightedProductSchema.pre('save', function (next) {
  if (this.products.length > 4) {
    next(new Error('Cannot exceed 4 products in highlighted list.'));
  } else {
    next();
  }
});

const HighlightedProduct = mongoose.model('HighlightedProduct', highlightedProductSchema);

module.exports = HighlightedProduct;
