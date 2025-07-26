// routes/wishListRoutes.js
const express = require('express');
const {
  addItemToWishList,
  removeItemFromWishList,
  getWishList,
  removeAllItemsFromWishList
} = require('../controllers/wishListController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', addItemToWishList);
router.delete('/remove', removeItemFromWishList);
router.get('/:userId', getWishList);
router.delete('/clear', removeAllItemsFromWishList);

module.exports = router;
