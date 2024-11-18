// controllers/newArrivalsController.js
const NewArrivals = require('../models/NewArrivals');

// Add a product to new arrivals
exports.addNewArrival = async (req, res) => {
  const { productId } = req.body;

  try {
    let newArrivals = await NewArrivals.findOne();

    // If newArrivals list doesn't exist, create one
    if (!newArrivals) {
      newArrivals = new NewArrivals({ products: [] });
    }

    // Check if product is already in new arrivals list
    if (newArrivals.products.includes(productId)) {
      return res.status(400).json({ message: 'Product is already in new arrivals list' });
    }

    // Add product to the front of the array (to behave like a queue)
    newArrivals.products.unshift(productId);

    // Limit to 20 items
    if (newArrivals.products.length > 20) {
      newArrivals.products.pop(); // Remove oldest item if exceeding limit
    }

    await newArrivals.save();
    res.status(200).json({ message: 'Product added to new arrivals', newArrivals });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to new arrivals', error });
  }
};

// Fetch all new arrivals
exports.getNewArrivals = async (req, res) => {
  try {
    const newArrivals = await NewArrivals.findOne().populate('products');

    if (!newArrivals) {
      return res.status(404).json({ message: 'No new arrivals found' });
    }

    res.status(200).json(newArrivals.products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching new arrivals', error });
  }
};



// Clear new arrivals list
exports.clearNewArrivals = async (req, res) => {
    try {
      await NewArrivals.updateOne({}, { products: [] });
      res.status(200).json({ message: 'New arrivals cleared successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error clearing new arrivals', error });
    }
  };