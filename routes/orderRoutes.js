// // routes/orderRoutes.js
// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/orderController');
// const protect = require('../middleware/authMiddleware');

// router.post('/create', orderController.createOrder);
// router.get('/:id', orderController.getOrderById);
// router.get('/user/:userId', orderController.getOrdersByUser);
// router.get('/admin/orders', orderController.getAllOrders);
// router.patch('/admin/orders', orderController.updateDeliveryStatus);

// module.exports = router;




const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

// Create order
router.post('/create', orderController.createOrder);

// Fetch orders
router.get('/:id', orderController.getOrderById);
router.get('/user/:userId', orderController.getOrdersByUser);
router.get('/admin/orders', orderController.getAllOrders);

// Update delivery status (Manual update by admin)
router.patch('/admin/update-shipment', orderController.updateShipmentStatus);

router.post('/admin/orders/create-shipment', orderController.createShipment);

// Assign shipment to Shiprocket (automation)
router.post('/admin/orders/assign-shipment', orderController.assignShipment);

// Track shipment (Shiprocket or manual carrier)
router.get('/admin/orders/:orderId/track', orderController.trackShipment);

// 🔹 Cancel order item (User/Admin)
router.post("/cancel-item", orderController.cancelOrderItem);

// 🔹 Update cancellation status (Admin)
router.post("/cancel-item/update", orderController.updateCancellationStatus);

// 🔹 Request return (User)
router.post("/return-item", orderController.requestReturn);

// 🔹 Update return status (Admin)
router.post("/return-item/update", orderController.updateReturnStatus);

module.exports = router;
