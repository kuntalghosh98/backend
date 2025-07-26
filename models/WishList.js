// models/WishList.js
const mongoose = require('mongoose');

const wishListItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
}, { _id: false });

const wishListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [wishListItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('WishList', wishListSchema);

