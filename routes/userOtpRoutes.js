// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { requestEmailOTP, verifyEmailOTP } = require('../controllers/userOtp');

// OTP Routes
router.post('/request-email-otp', requestEmailOTP);
router.post('/verify-email-otp', verifyEmailOTP);

module.exports = router;
