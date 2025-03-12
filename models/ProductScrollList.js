const mongoose = require('mongoose');

const ProductScrollListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  listNumber: { type: Number, required: true, unique: true },
  productIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    validate: [arrayLimit, '{PATH} exceeds the limit of 20']
  }
});

// Ensure productIds do not exceed 20 items
function arrayLimit(val) {
  return val.length <= 20;
}

module.exports = mongoose.model('ProductScrollList', ProductScrollListSchema);
