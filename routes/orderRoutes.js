// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

router.post('/create', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.get('/user/:userId', orderController.getOrdersByUser);
router.get('/admin/orders', orderController.getAllOrders);
router.patch('/admin/orders', orderController.updateDeliveryStatus);

module.exports = router;