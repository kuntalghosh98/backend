const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/', // Ensure this folder exists
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadMiddleware = (fieldName) => {
  return multer({
    storage,
    limits: { fileSize: 8000000 }, // 8MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb('Error: Images only!');
      }
    },
  }).single(fieldName); // Single file upload
};

module.exports = uploadMiddleware;
