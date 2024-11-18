const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

// Create order route
router.post('/order', createOrder);

// Verify payment route
router.post('/verify', verifyPayment);

module.exports = router;
