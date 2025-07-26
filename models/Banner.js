// models/Banner.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  insideimage: {
    type: String,
    required: true,
    trim: true,
  },
});

const bannerSchema = new mongoose.Schema({
  bannerNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
  },
  cards: {
    type: [cardSchema],
    validate: [arrayLimit, 'Maximum 10 cards allowed per banner'],
  },
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('Banner', bannerSchema);

