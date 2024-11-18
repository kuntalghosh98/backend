const express = require('express');
const router = express.Router();
const newArrivalsController = require('../controllers/newArrivalsController');

// Add a product to new arrivals
router.post('/add', newArrivalsController.addNewArrival);

// Get all new arrivals
router.get('/', newArrivalsController.getNewArrivals);

module.exports = router;
