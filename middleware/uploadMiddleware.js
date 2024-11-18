// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename:  (req, file, cb)=> {
   return cb(null, `${file.fieldname}_ ${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Create a factory function for dynamic field name
const uploadMiddleware = (fieldName) => {
  return multer({
    storage: storage,
    limits: { fileSize: 8000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  }).single(fieldName);
};

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

module.exports = uploadMiddleware;
