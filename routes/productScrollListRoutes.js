// routes/productScrollListRoutes.js
const express = require('express');
const {
  getAllScrollLists,
  getScrollListById,
  addScrollList,
  editScrollList,
  deleteScrollList
} = require('../controllers/productScrollListController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllScrollLists);
router.get('/:id', getScrollListById);
router.post('/add', protect, addScrollList);
router.put('/edit/:id', protect, editScrollList);
router.delete('/delete/:id', protect, deleteScrollList);

module.exports = router;