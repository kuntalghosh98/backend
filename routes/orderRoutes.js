const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/create', orderController.createOrder);

// Get a single order by ID
router.get('/:id', orderController.getOrderById);

// Get all orders by a user
router.get('/user/:userId', orderController.getOrdersByUser);

module.exports = router;
