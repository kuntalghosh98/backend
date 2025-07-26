// routes/productRoutes.js
const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/add', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;