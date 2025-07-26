const express = require('express');
const router = express.Router();
const newArrivalsController = require('../controllers/newArrivalsController');

router.post('/add', newArrivalsController.addNewArrival);
router.get('/', newArrivalsController.getNewArrivals);
router.delete('/clear', newArrivalsController.clearNewArrivals); // Added clear route
router.delete('/:productId', newArrivalsController.removeNewArrival);

module.exports = router;
