// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// Use multer memory storage for uploading to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', (req, res, next) => {
    console.log("Request reached upload route");
    next();
  }, upload.single('image'), uploadController.uploadImage);

module.exports = router;
