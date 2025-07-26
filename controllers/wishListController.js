// controllers/wishListController.js
const WishList = require('../models/WishList');
const Product = require('../models/Product');

exports.addItemToWishList = async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ message: 'Missing userId or productId' });

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let wishList = await WishList.findOne({ userId });
    if (!wishList) {
      wishList = new WishList({ userId, items: [{ productId }] });
    } else {
      const exists = wishList.items.some(item => item.productId.toString() === productId);
      if (exists) return res.status(200).json({ message: 'Product already in wishlist' });
      wishList.items.push({ productId });
    }

    await wishList.save();
    res.status(200).json({ message: 'Product added to wishlist', wishList });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message || error });
  }
};

exports.removeItemFromWishList = async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ message: 'Missing userId or productId' });

  try {
    const wishList = await WishList.findOne({ userId });
    if (!wishList) return res.status(404).json({ message: 'Wishlist not found' });

    wishList.items = wishList.items.filter(item => item.productId.toString() !== productId);
    await wishList.save();

    res.status(200).json({ message: 'Product removed from wishlist', wishList });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message || error });
  }
};

exports.getWishList = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  try {
    const wishList = await WishList.findOne({ userId }).populate('items.productId');
    if (!wishList) return res.status(404).json({ message: 'Wishlist not found' });
    res.status(200).json(wishList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message || error });
  }
};

exports.removeAllItemsFromWishList = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  try {
    const wishList = await WishList.findOne({ userId });
    if (!wishList) return res.status(404).json({ message: 'Wishlist not found' });

    wishList.items = [];
    await wishList.save();

    res.status(200).json({ message: 'All items removed from wishlist', wishList });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing wishlist', error: error.message || error });
  }
};

