// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   stock: {
//     type: Number,
//     required: true,
//   },
//   imageUrl: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Product', productSchema);




const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema({
  size: {
    type: String
    
  },
  stock: {
    type: Number,
    required: true,
  },
});

const variantSchema = new mongoose.Schema({
  color: {
    type: String,

  },
  sizeStock: [sizeStockSchema],
  imageUrls: {
    type: [String], // Array of strings to store multiple image URLs
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  category: {
    type: String,
    required: true,
  },
  variants: [variantSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
