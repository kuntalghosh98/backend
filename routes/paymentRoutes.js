// const express = require('express');
// const router = express.Router();
// const { createOrder, verifyPayment } = require('../controllers/paymentController');

// router.post('/razorpay/create-order', createOrder);
// router.post('/razorpay/verify-payment', verifyPayment);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');

router.post('/razorpay/create-order', protect, createOrder);
router.post('/razorpay/verify-payment', protect, verifyPayment); // 🛡️ protected now

module.exports = router;