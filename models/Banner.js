// models/Banner.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const bannerSchema = new Schema({
  bannerNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  cards: [cardSchema], // Array of card objects
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
