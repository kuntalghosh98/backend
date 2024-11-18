const express = require('express');
const { addItemToCart, updateCartItem, removeItemFromCart, getCart,removeAllItemsFromCart } = require('../controllers/cartController');
const router = express.Router();

router.post('/add', addItemToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeItemFromCart);
router.get('/:userId', getCart);
router.delete('/clear', removeAllItemsFromCart);

module.exports = router;
