// routes/cartRoutes.js
const express = require('express');
const {
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  getCart,
  removeAllItemsFromCart
} = require('../controllers/cartController');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

router.post('/', addItemToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeItemFromCart);
router.get('/:userId', getCart);
router.delete('/clear', removeAllItemsFromCart);

module.exports = router;