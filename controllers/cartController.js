const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
exports.addItemToCart = async (req, res) => {
  const { userId, productId, size,veriantColor } = req.body;
  console.log("add to cart",veriantColor);

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log();

    // Find user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item with the same size already exists in the cart
    const existingItem = cart.items.find(
      item => item.productId.toString() === productId && item.size === size && item.veriantColor===veriantColor
    );

    if (existingItem) {
      // Update quantity of existing item
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cart.items.push({ productId, quantity: 1, size,veriantColor });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
};

// Update item in cart with cartItemId included
exports. updateCartItem = async (req, res) => {
    const { userId, cartItemId, productId, size, quantity,veriantColor } = req.body;
  
    try {
      // Find user's cart
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Find the specific item in the cart
      const itemIndex = cart.items.findIndex(item => item._id.toString() === cartItemId);
  
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      const existingItem = cart.items[itemIndex];
      console.log(existingItem);
      console.log("existing-------------------------")
  
      // Check if there's already an item with the same productId and new size
      const newItemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.size === size && item.veriantColor==veriantColor);
  console.log(newItemIndex);
  console.log("new index-------------------------------------------")
  console.log(itemIndex);
      if (newItemIndex !== -1) {

        console.log(" if block ------------------------------------------------------------------------------------");
        // Remove the existing item
        
        // If newItemIndex is found, merge quantities and remove the existing item 
        if(newItemIndex!=itemIndex){
          const newItem = cart.items[newItemIndex];
        newItem.quantity += existingItem.quantity;
        cart.items.splice(itemIndex, 1);
        }else{
          existingItem.quantity = quantity;
        }
         
         
      } else {
        // Update the existing item with new size and quantity
        existingItem.size = size;
        existingItem.quantity = quantity;
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error updating item in cart', error });
    }
  };
  
// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
    const { userId, cartItemId } = req.body;
  console.log("removecart")
    try {
      // Find user's cart
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Find item in the cart by cartItemId
      const itemIndex = cart.items.findIndex(item => item._id.toString() === cartItemId);
  
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      // Remove item from cart
      cart.items.splice(itemIndex, 1);
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error removing item from cart', error });
    }
  };
  

// Get user's cart
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};


// Remove all items from the cart
exports.removeAllItemsFromCart = async (req, res) => {
  const { userId } = req.body; // or req.params if you want to pass it as a URL parameter
console.log("userId------------------------------",userId)

  try {
    // Find user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear all items in the cart
    cart.items = [];

    // Save the cart with no items
    await cart.save();

    res.status(200).json({ message: 'All items removed from the cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing all items from the cart', error });
  }
};
