// // backend/routes/locationRoutes.js
// const express = require('express');
// const router = express.Router();
// const { reverseGeocode } = require('../controllers/locationController');

// router.post('/reverse-geocode', reverseGeocode);

// module.exports = router;





const express = require('express');
const { reverseGeocode } = require('../controllers/locationController');
const router = express.Router();

router.post('/reverse-geocode', reverseGeocode);

module.exports = router;
