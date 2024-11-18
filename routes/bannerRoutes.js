// routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// Add or update a banner with cards
router.post('/add-or-update', bannerController.addOrUpdateBanner);

// Get all banners
router.get('/', bannerController.getAllBanners);

// Get banner by bannerNumber
router.get('/:bannerNumber', bannerController.getBannerByNumber);

module.exports = router;
