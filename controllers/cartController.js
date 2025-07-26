// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCartOrCreate = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await cart.save();
  }
  return cart;
};

// exports.addItemToCart = async (req, res) => {
//   console.log("Adding item to cart");
//   const { userId, productId, size, variantColor } = req.body;
//   if (!userId || !productId) return res.status(400).json({ message: 'Missing userId or productId' });

//   try {
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     const cart = await getCartOrCreate(userId);
//     const existingItem = cart.items.find(
//       item => item.productId.toString() === productId && item.size === size && item.variantColor === variantColor
//     );

//     if (existingItem) {
//       existingItem.quantity += 1;
//     } else {
//       cart.items.push({ productId, quantity: 1, size, variantColor });
//     }

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding item to cart', error });
//   }
// };


exports.addItemToCart = async (req, res) => {
  console.log("Adding item to cart");
  const { userId, productId, size = null, variantColor = null } = req.body;

  if (!userId || !productId)
    return res.status(400).json({ message: 'Missing userId or productId' });

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    const cart = await getCartOrCreate(userId);

    const existingItem = cart.items.find(
      item =>
        item.productId.toString() === productId.toString() &&
        item.size === size &&
        item.variantColor === variantColor
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId,
        quantity: 1,
        size,
        variantColor,
      });
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addItemToCart:", error);
    return res.status(500).json({ message: 'Error adding item to cart', error });
  }
};


exports.updateCartItem = async (req, res) => {
  console.log("Updating cart item");
  const { userId, cartItemId, productId, size, quantity, variantColor } = req.body;
  if (!userId || !cartItemId || !productId) return res.status(400).json({ message: 'Missing fields' });

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item._id.toString() === cartItemId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Cart item not found' });

    const existingItem = cart.items[itemIndex];
    const duplicateIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.size === size && item.variantColor === variantColor
    );

    if (duplicateIndex !== -1 && duplicateIndex !== itemIndex) {
      cart.items[duplicateIndex].quantity += existingItem.quantity;
      cart.items.splice(itemIndex, 1);
    } else {
      existingItem.size = size;
      existingItem.variantColor = variantColor;
      existingItem.quantity = quantity;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item in cart', error });
  }
};

exports.removeItemFromCart = async (req, res) => {
  console.log("Removing item from cart");

  const { userId, cartItemId } = req.body;
  if (!userId || !cartItemId) return res.status(400).json({ message: 'Missing fields' });

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log("Cart not found for userId:", userId);
      return res.status(404).json({ message: 'Cart not found' });
    }

    const index = cart.items.findIndex(item => item && item.productId && item.productId.toString() === cartItemId);

    if (index === -1) {
      console.log("Item not found in cart:", cartItemId);
      return res.status(404).json({ message: 'Item not found' });
    }

    cart.items.splice(index, 1);
    await cart.save();

    console.log("Item removed. Updated cart:", cart);
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: 'Error removing item from cart', error: error.message || error });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

exports.removeAllItemsFromCart = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'All items removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};

