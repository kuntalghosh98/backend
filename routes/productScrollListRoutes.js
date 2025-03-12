const express = require('express');
const router = express.Router();
const productScrollListController = require('../controllers/productScrollListController');

router.get('/', productScrollListController.getAllScrollLists);
router.get('/:id', productScrollListController.getScrollListById);
router.post('/add', productScrollListController.addScrollList);
router.put('/edit/:id', productScrollListController.editScrollList);
router.delete('/delete/:id', productScrollListController.deleteScrollList);

module.exports = router;
