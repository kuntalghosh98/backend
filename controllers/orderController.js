// const Order = require('../models/Order');
// const Product = require('../models/Product');

// // Create a new order
// exports.createOrder = async (req, res) => {
//   const { userId, products } = req.body;

//   try {
//     let totalPrice = 0;

//     // Calculate total price and validate product existence
//     for (const item of products) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         return res.status(404).json({ message: `Product with ID ${item.product} not found` });
//       }
//       totalPrice += product.price * item.quantity;
//     }

//     const newOrder = new Order({
//       user: userId,
//       products: products.map(item => ({
//         product: item.product,
//         quantity: item.quantity,
//         price: item.price,
//       })),
//       totalPrice,
//     });

//     await newOrder.save();
//     res.status(201).json({ message: 'Order created successfully', order: newOrder });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating order', error });
//   }
// };

// // Get all orders for a user
// exports.getOrdersByUser = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const orders = await Order.find({ user: userId }).populate('products.product');
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching orders', error });
//   }
// };

// // Get a single order by ID
// exports.getOrderById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const order = await Order.findById(id).populate('products.product');
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
//     res.status(200).json(order);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching order', error });
//   }
// };

// // Update order status
// exports.updateOrderStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
//     if (!updatedOrder) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
//     res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating order status', error });
//   }
// };

// // Delete an order
// exports.deleteOrder = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedOrder = await Order.findByIdAndDelete(id);
//     if (!deletedOrder) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
//     res.status(200).json({ message: 'Order deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting order', error });
//   }
// };































const Order = require('../models/Order');
const Cart = require("../models/Cart"); // Import Cart model
// // Create a new order
// exports.createOrder = async (req, res) => {
//   const { userId, items, address, paymentResponse } = req.body;
//    console.log("order---------------------------------------------------------------------------")
//    console.log(userId)
//    console.log(items)
//    console.log(address)
//    console.log(paymentResponse)
//    console.log("---------------------------------------------------------------------------------")
//   try {
//     const newOrder = new Order({
//       orderId: paymentResponse.razorpayOrderId, // Order ID from Razorpay response
//       userId,
//       payment: {
//         razorpayPaymentId: paymentResponse.razorpayPaymentId,
//         razorpayOrderId: paymentResponse.razorpayOrderId,
//         razorpaySignature: paymentResponse.razorpaySignature,
//         amount:paymentResponse.amount,
//         createdAt:paymentResponse.createdAt,
//         currency:paymentResponse.currency,
//         receipt:paymentResponse.receipt,
//         status: paymentResponse.status, // Assuming payment is successful
//       },
//       items: items.map(item => ({
//         productId: item.productId,
//         quantity: item.quantity,
//         size: item.size,
//         variantColor: item.variantColor,
//         deliveryStatus: 'pending', // Default delivery status
//       })),
//       address: {
//         name: address.name,
//         mobileNumber: address.mobileNumber,
//         pincode: address.pincode,
//         locality: address.locality,
//         flatNumber: address.flatNumber,
//         landmark: address.landmark,
//         district: address.district,
//         state: address.state,
//         addressType: address.addressType,
//       },
//     });

//     // Save the order to the database
//     await newOrder.save();

//     res.status(201).json({ message: 'Order created successfully', order: newOrder });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: 'Error creating order', error });
//   }
// };







// Create a new order
// exports.createOrder = async (req, res) => {
//   const { userId, items, address, paymentResponse } = req.body;
//   console.log("order---------------------------------------------------------------------------");
//   console.log(userId);
//   console.log(items);
//   console.log(address);
//   console.log(paymentResponse);
//   console.log("---------------------------------------------------------------------------------");

//   try {
//     const newOrder = new Order({
//       orderId: paymentResponse.razorpayOrderId, // Order ID from Razorpay response
//       userId,
//       payment: {
//         razorpayPaymentId: paymentResponse.razorpayPaymentId,
//         razorpayOrderId: paymentResponse.razorpayOrderId,
//         razorpaySignature: paymentResponse.razorpaySignature,
//         amount: paymentResponse.amount,
//         createdAt: paymentResponse.createdAt,
//         currency: paymentResponse.currency,
//         receipt: paymentResponse.receipt,
//         status: paymentResponse.status, // Assuming payment is successful
//       },
//       items: items.map(item => ({
//         productId: item.productId,
//         quantity: item.quantity,
//         size: item.size,
//         variantColor: item.variantColor,
//         price: item.price, // Ensure price is included in request payload
//         appliedDiscount: item.appliedDiscount || 0, // Default discount if not provided
//         deliveryStatus: 'pending', // Default delivery status
//         return: {
//           applicable: item.return?.applicable || false, // Set default return applicability
//           initiated: false, // Default return initiation status
//           status: 'initiated', // Default return status
//         },
//       })),
//       address: {
//         name: address.name,
//         mobileNumber: address.mobileNumber,
//         pincode: address.pincode,
//         locality: address.locality,
//         flatNumber: address.flatNumber,
//         landmark: address.landmark,
//         district: address.district,
//         state: address.state,
//         addressType: address.addressType,
//       },
//     });

//     // Save the order to the database
//     await newOrder.save();

//     res.status(201).json({ message: 'Order created successfully', order: newOrder });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Error creating order', error });
//   }
// };


// Create a new order
exports.createOrder = async (req, res) => {
  const { userId, address, paymentResponse } = req.body; // No need to pass items from frontend

  console.log("Creating Order...");
  console.log("User ID:", userId);
  console.log("Address:", address);
  console.log("Payment Response:", paymentResponse);

  try {
    // **1. Fetch Cart Items from Database**
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Cannot place order." });
    }

    // **2. Process Items**
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      size: item.size,
      variantColor: item.veriantColor || "", // Handle missing variantColor safely
      quantity: item.quantity,
      price: item.productId.price, // Get price from DB
      appliedDiscount: 0, // Default discount
      deliveryStatus: "pending",
      return: {
        applicable: false,
        initiated: false,
        status: "initiated",
      },
    }));

    // **3. Create a New Order**
    const newOrder = new Order({
      orderId: paymentResponse.razorpayOrderId, // Order ID from Razorpay response
      userId,
      payment: {
        razorpayPaymentId: paymentResponse.razorpayPaymentId,
        razorpayOrderId: paymentResponse.razorpayOrderId,
        razorpaySignature: paymentResponse.razorpaySignature,
        amount: paymentResponse.amount,
        createdAt: paymentResponse.createdAt,
        currency: paymentResponse.currency,
        receipt: paymentResponse.receipt,
        status: paymentResponse.status, // Assuming payment is successful
      },
      items: orderItems,
      address: {
        name: address.name,
        mobileNumber: address.mobileNumber,
        pincode: address.pincode,
        locality: address.locality,
        flatNumber: address.flatNumber,
        landmark: address.landmark,
        district: address.district,
        state: address.state,
        addressType: address.addressType,
      },
    });

    // **4. Save Order to Database**
    await newOrder.save();

    // **5. Clear Cart After Order (Optional)**
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error });
  }
};






// Get an order by ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  console.log("oredr Id",id)

  try {
    const order = await Order.findById(id).populate('items.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Get all orders by a user
exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId, "payment.status": "completed" }).populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};


// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    console.log()
    const orders = await Order.find()
      .populate('items.productId')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};


exports.updateDeliveryStatus = async (req, res) => {
  const { orderId, productId, deliveryStatus } = req.body; // Retrieve everything from body

  try {
    // Update delivery status for the specific item in the order
    const order = await Order.findOneAndUpdate(
      { _id: orderId, 'items.productId': productId }, // Match productId
      { $set: { 'items.$.deliveryStatus': deliveryStatus } }, // Update delivery status
      { new: true } // Return updated order
    );

    if (!order) {
      return res.status(404).json({ message: 'Order or item not found' });
    }

    res.status(200).json({ message: 'Delivery status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status', error });
  }
};
