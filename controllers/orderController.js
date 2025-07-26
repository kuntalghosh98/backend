// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  const { userId, address, paymentResponse } = req.body;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Cannot place order.' });
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      size: item.size,
      variantColor: item.veriantColor || '',
      quantity: item.quantity,
      price: item.productId.price,
      appliedDiscount: 0,
      deliveryStatus: 'pending',
      return: {
        applicable: false,
        initiated: false,
        status: 'initiated',
      },
    }));

    const newOrder = new Order({
      orderId: paymentResponse.razorpayOrderId,
      userId,
      payment: {
        razorpayPaymentId: paymentResponse.razorpayPaymentId,
        razorpayOrderId: paymentResponse.razorpayOrderId,
        razorpaySignature: paymentResponse.razorpaySignature,
        amount: paymentResponse.amount,
        createdAt: paymentResponse.createdAt,
        currency: paymentResponse.currency,
        receipt: paymentResponse.receipt,
        status: paymentResponse.status,
      },
      items: orderItems,
      address,
    });

    await newOrder.save();
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate('items.productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId, 'payment.status': 'completed' }).populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  const { orderId, productId, deliveryStatus } = req.body;
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, 'items.productId': productId },
      { $set: { 'items.$.deliveryStatus': deliveryStatus } },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order or item not found' });
    res.status(200).json({ message: 'Delivery status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status', error });
  }
};



