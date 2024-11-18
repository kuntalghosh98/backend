// routes/highlightedProductRoutes.js
const express = require('express');
const router = express.Router();
const highlightedProductController = require('../controllers/highlightedProductController');

// Add a highlighted product
router.post('/add', highlightedProductController.addHighlightedProduct);

// Update a highlighted product
router.put('/update', highlightedProductController.updateHighlightedProduct);

// Get all highlighted products
router.get('/', highlightedProductController.getHighlightedProducts);

module.exports = router;
