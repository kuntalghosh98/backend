// routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Add a new address
router.post('/add', addressController.addAddress);

// Get all addresses for a user
router.get('/:userId', addressController.getAddresses);

// Update an address
router.put('/update/:id', addressController.updateAddress);

// Delete an address
router.delete('/delete/:id', addressController.deleteAddress);

// Set an address as default
router.post('/set-default', addressController.setDefaultAddress);

module.exports = router;
