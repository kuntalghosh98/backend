// models/NewArrivals.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newArrivalsSchema = new Schema({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

const NewArrivals = mongoose.model('NewArrivals', newArrivalsSchema);

module.exports = NewArrivals;
