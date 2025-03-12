const WishList = require('../models/WishList');
const Product = require('../models/Product');

// ✅ Add item to wishList
exports.addItemToWishList = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find user's wishList
    let wishList = await WishList.findOne({ userId });

    if (!wishList) {
      // If wishlist doesn't exist, create a new one
      wishList = new WishList({ userId, items: [{ productId }] });
    } else {
      // Check if product is already in wishlist
      const productExists = wishList.items.some(item => item.productId.toString() === productId);

      if (productExists) {
        return res.status(200).json({ message: 'Product already added to wishlist' });
      }

      // Add new product to wishlist
      wishList.items.push({ productId });
    }

    await wishList.save();
    res.status(200).json({ message: 'Product added to wishlist', wishList });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to wishlist', error });
  }
};

// ✅ Remove item from wishList
exports.removeItemFromWishList = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find user's wishlist
    const wishList = await WishList.findOne({ userId });

    if (!wishList) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Filter out the product from the wishlist
    wishList.items = wishList.items.filter(item => item.productId.toString() !== productId);

    await wishList.save();
    res.status(200).json({ message: 'Product removed from wishlist', wishList });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from wishlist', error });
  }
};

// ✅ Get user's wishList
exports.getWishList = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user's wishlist and populate product details
    const wishList = await WishList.findOne({ userId }).populate('items.productId');

    if (!wishList) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json(wishList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};

// ✅ Remove all items from the wishList
exports.removeAllItemsFromWishList = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find user's wishlist
    const wishList = await WishList.findOne({ userId });

    if (!wishList) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Clear all items in the wishlist
    wishList.items = [];

    await wishList.save();
    res.status(200).json({ message: 'All items removed from wishlist', wishList });
  } catch (error) {
    res.status(500).json({ message: 'Error removing all items from wishlist', error });
  }
};
