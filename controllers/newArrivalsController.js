const NewArrivals = require('../models/NewArrivals');

// ✅ Add product to new arrivals (queue style, limit 20)
exports.addNewArrival = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    let newArrivals = await NewArrivals.findOne();

    if (!newArrivals) {
      newArrivals = new NewArrivals({ products: [] });
    }

    const alreadyExists = newArrivals.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return res.status(409).json({ message: 'Product already in new arrivals' });
    }

    newArrivals.products.unshift(productId);

    if (newArrivals.products.length > 20) {
      newArrivals.products.pop();
    }

    await newArrivals.save();
    res.status(200).json({ message: 'Product added to new arrivals', newArrivals });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product to new arrivals', error });
  }
};

// ✅ Get all new arrivals
exports.getNewArrivals = async (req, res) => {
  try {
    const newArrivals = await NewArrivals.findOne().populate('products');

    if (!newArrivals || newArrivals.products.length === 0) {
      return res.status(404).json({ message: 'No new arrivals found' });
    }

    res.status(200).json(newArrivals.products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching new arrivals', error });
  }
};

// ✅ Clear new arrivals list
exports.clearNewArrivals = async (req, res) => {
  try {
    const result = await NewArrivals.updateOne({}, { $set: { products: [] } });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No new arrivals list found to clear' });
    }

    res.status(200).json({ message: 'New arrivals cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing new arrivals', error });
  }
};


// ✅ Remove individual product
exports.removeNewArrival = async (req, res) => {
  const { productId } = req.params;

  try {
    const result = await NewArrivals.updateOne({}, {
      $pull: { products: productId }
    });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Product not found in new arrivals' });
    }

    res.status(200).json({ message: 'Product removed from new arrivals' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product', error });
  }
};
