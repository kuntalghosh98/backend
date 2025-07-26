// routes/highlightedProductRoutes.js
const express = require('express');
const {
  addHighlightedProduct,
  updateHighlightedProduct,
  getHighlightedProducts,
} = require('../controllers/highlightedProductController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addHighlightedProduct);
router.put('/update', protect, updateHighlightedProduct);
router.get('/', getHighlightedProducts);

module.exports = router;