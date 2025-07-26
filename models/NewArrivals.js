const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newArrivalsSchema = new Schema({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
}, {
  timestamps: true, // Useful for admin tracking
});

module.exports = mongoose.model('NewArrivals', newArrivalsSchema);
