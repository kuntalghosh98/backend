// controllers/highlightedProductController.js
const HighlightedProduct = require('../models/HighlightedProduct');

exports.addHighlightedProduct = async (req, res) => {
  const { productNumber, image, products } = req.body;

  try {
    if (!productNumber || !image || !Array.isArray(products)) {
      return res.status(400).json({ success: false, message: 'Invalid input format' });
    }

    if (products.length > 4) {
      return res.status(400).json({ success: false, message: 'Cannot add more than 4 products' });
    }

    const newHighlightedProduct = await HighlightedProduct.create({ productNumber, image, products });
    res.status(201).json({ success: true, data: newHighlightedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding highlighted product', error });
  }
};

exports.updateHighlightedProduct = async (req, res) => {
  const { productNumber, image, products } = req.body;

  try {
    const highlightedProduct = await HighlightedProduct.findOne({ productNumber });

    if (!highlightedProduct) {
      return res.status(404).json({ success: false, message: 'Highlighted product not found' });
    }

    if (products?.length > 4) {
      return res.status(400).json({ success: false, message: 'Cannot add more than 4 products' });
    }

    if (image) highlightedProduct.image = image;
    if (products) highlightedProduct.products = products;

    await highlightedProduct.save();
    res.status(200).json({ success: true, data: highlightedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating highlighted product', error });
  }
};

exports.getHighlightedProducts = async (req, res) => {
  try {
    const highlightedProducts = await HighlightedProduct.find().populate('products');
    res.status(200).json({ success: true, data: highlightedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching highlighted products', error });
  }
};


