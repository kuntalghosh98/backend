// models/Product.js
const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
});

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    trim: true,
  },
  sizeStock: [sizeStockSchema],
  imageUrls: {
    type: [String],
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    variants: [variantSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
