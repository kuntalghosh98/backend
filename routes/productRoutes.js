// backend/routes/productRoutes.js
const express = require('express');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImage
    
} = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware'); // Import the multer middleware
const router = express.Router();




router.post('/upload/:fieldName', uploadProductImage);
router.post('/add', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct); // Include upload middleware for updating products
router.delete('/:id', deleteProduct);

module.exports = router;
