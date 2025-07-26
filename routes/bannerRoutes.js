// routes/bannerRoutes.js
const express = require('express');
const {
  addOrUpdateBanner,
  getAllBanners,
  getBannerByNumber
} = require('../controllers/bannerController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add-or-update', protect, addOrUpdateBanner);
router.get('/', getAllBanners);
router.get('/:bannerNumber', getBannerByNumber);

module.exports = router;