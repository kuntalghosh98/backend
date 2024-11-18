// controllers/highlightedProductController.js
const HighlightedProduct = require('../models/HighlightedProduct');

// Add a new highlighted product
exports.addHighlightedProduct = async (req, res) => {
  const { productNumber, image, products } = req.body;

  try {
    // Validate products array length
    if (products.length > 4) {
      return res.status(400).json({ message: 'Cannot add more than 4 products' });
    }

    const newHighlightedProduct = new HighlightedProduct({
      productNumber,
      image,
      products,
    });

    await newHighlightedProduct.save();
    res.status(201).json(newHighlightedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding highlighted product', error });
  }
};

// Update a highlighted product
exports.updateHighlightedProduct = async (req, res) => {
  const { productNumber, image, products } = req.body;

  try {
    // Find highlighted product by productNumber
    const highlightedProduct = await HighlightedProduct.findOne({ productNumber });
    if (!highlightedProduct) {
      return res.status(404).json({ message: 'Highlighted product not found' });
    }

    // Update fields
    if (image) highlightedProduct.image = image;
    if (products) {
      if (products.length > 4) {
        return res.status(400).json({ message: 'Cannot add more than 4 products' });
      }
      highlightedProduct.products = products;
    }

    await highlightedProduct.save();
    res.status(200).json(highlightedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating highlighted product', error });
  }
};

// Get all highlighted products
exports.getHighlightedProducts = async (req, res) => {
  try {
    const highlightedProducts = await HighlightedProduct.find().populate('products');
    res.status(200).json(highlightedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching highlighted products', error });
  }
};
