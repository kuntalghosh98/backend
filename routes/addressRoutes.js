// routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const protect = require('../middleware/authMiddleware');

router.post('/add', addressController.addAddress);
router.get('/:userId', addressController.getAddresses);
router.put('/update/:id', addressController.updateAddress);
router.delete('/delete/:id', addressController.deleteAddress);
router.post('/set-default', addressController.setDefaultAddress);

module.exports = router;
