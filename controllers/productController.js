const Product = require('../models/Product');
const path = require('path');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const mongoose = require('mongoose');


// // Create a new product
// exports.createProduct = async (req, res) => {
//   const { name, description, price, category, stock, imageUrl } = req.body;
  
//   try {
//     const newProduct = new Product({ name, description, price, category, stock, imageUrl });
//     await newProduct.save();
//     res.status(201).json({ message: 'Product created successfully', product: newProduct });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating product', error });
//   }
// };


// // Get all products
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching products', error });
//   }
// };

// // Get a single product by ID
// exports.getProductById = async (req, res) => {
//   const { id } = req.params;
//   // Check if the provided ID is a valid MongoDB ObjectId
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid product ID' });
//   }
  
//   try {
//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching product', error });
//   }
// };

// // Update a product
// exports.updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const { name, description, price, category, stock, imageUrl } = req.body;
  
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, category, stock, imageUrl }, { new: true });
//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating product', error });
//   }
// };

// // Delete a product
// exports.deleteProduct = async (req, res) => {
//   const { id } = req.params;
  
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(id);
//     if (!deletedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting product', error });
//   }
// };

// Upload product image
// exports.uploadProductImage = (req, res) => {
//   const upload = uploadMiddleware(req.params.fieldName);
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({ message: err });
//     } else {
//       if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//       } else {
//         const imageUrl = `/uploads/${req.file.filename}`;
//         res.status(200).json({ imageUrl });
//       }
//     }
//   });
// };




// Upload product image
exports.uploadProductImage = (req, res) => {
  console.log('Field Name:', req.params.fieldName); // Log dynamic field name
  const upload = uploadMiddleware(req.params.fieldName);

  upload(req, res, (err) => {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(400).json({ message: err });
    }

    console.log('File Received:', req.file); // Log file details
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('Generated Image URL:', imageUrl);
    res.status(200).json({ imageUrl });
  });
};



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Create a new product
exports.createProduct = async (req, res) => {
  const { name, description, price,discounte, category, variants } = req.body;
  
  try {
    const newProduct = new Product({ name, description, price,discounte, category, variants });
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// // Update a product
// exports.updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const { name, description, price, category, variants } = req.body;
  
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, category, variants }, { new: true });
//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating product', error });
//   }
// };


// Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price,discounte, category, variants } = req.body;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    console.log('Updating product with ID:', id);
    console.log('Request body:', req.body);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price,discounte, category, variants },
      { new: true } // This option returns the modified document rather than the original
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
};
// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
