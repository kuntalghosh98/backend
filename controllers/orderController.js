// // controllers/orderController.js
// const Order = require('../models/Order');
// const Cart = require('../models/Cart');

// exports.createOrder = async (req, res) => {
//   const { userId, address, paymentResponse } = req.body;
//   try {
//     const cart = await Cart.findOne({ userId }).populate('items.productId');
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty. Cannot place order.' });
//     }

//     const orderItems = cart.items.map((item) => ({
//       productId: item.productId._id,
//       size: item.size,
//       variantColor: item.veriantColor || '',
//       quantity: item.quantity,
//       price: item.productId.price,
//       appliedDiscount: 0,
//       deliveryStatus: 'pending',
//       return: {
//         applicable: false,
//         initiated: false,
//         status: 'initiated',
//       },
//     }));

//     const newOrder = new Order({
//       orderId: paymentResponse.razorpayOrderId,
//       userId,
//       payment: {
//         razorpayPaymentId: paymentResponse.razorpayPaymentId,
//         razorpayOrderId: paymentResponse.razorpayOrderId,
//         razorpaySignature: paymentResponse.razorpaySignature,
//         amount: paymentResponse.amount,
//         createdAt: paymentResponse.createdAt,
//         currency: paymentResponse.currency,
//         receipt: paymentResponse.receipt,
//         status: paymentResponse.status,
//       },
//       items: orderItems,
//       address,
//     });

//     await newOrder.save();
//     // await Cart.findOneAndUpdate({ userId }, { items: [] });
//     res.status(201).json({ message: 'Order created successfully', order: newOrder });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating order', error });
//   }
// };

// exports.getOrderById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const order = await Order.findById(id).populate('items.productId');
//     if (!order) return res.status(404).json({ message: 'Order not found' });
//     res.status(200).json(order);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching order', error });
//   }
// };

// exports.getOrdersByUser = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const orders = await Order.find({ userId, 'payment.status': 'completed' }).populate('items.productId');
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching orders', error });
//   }
// };

// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate('items.productId').sort({ createdAt: -1 });
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching orders', error });
//   }
// };

// exports.updateDeliveryStatus = async (req, res) => {
//   const { orderId, productId, deliveryStatus } = req.body;
//   try {
//     const order = await Order.findOneAndUpdate(
//       { _id: orderId, 'items.productId': productId },
//       { $set: { 'items.$.deliveryStatus': deliveryStatus } },
//       { new: true }
//     );
//     if (!order) return res.status(404).json({ message: 'Order or item not found' });
//     res.status(200).json({ message: 'Delivery status updated successfully', order });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating delivery status', error });
//   }
// };






const Order = require('../models/Order');
const Cart = require('../models/Cart');
const shiprocketService = require('../services/shiprocketService');


exports.createOrder = async (req, res) => {
  const { userId, address, paymentResponse } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Cannot place order.' });
    }

    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      size: item.size,
      variantColor: item.variantColor || '',
      quantity: item.quantity,
      price: item.productId.price,
      appliedDiscount: 0,
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
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};







exports.assignShipment = async (req, res) => {
  const { orderId, selectedItems, type, courierName, trackingId, trackingUrl } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    let shipmentData = { items: selectedItems, type };

    if (type === 'manual') {
      shipmentData.courierName = courierName;
      shipmentData.trackingId = trackingId;
      shipmentData.trackingUrl = trackingUrl;
      shipmentData.status = 'shipped';
    }

    if (type === 'shiprocket') {
      const shipData = await shiprocketService.createShipment(order, selectedItems);
      shipmentData.shiprocket = shipData;
      shipmentData.trackingId = shipData.awbCode;
      shipmentData.trackingUrl = shipData.trackingUrl;
      shipmentData.courierName = shipData.courierName;
      shipmentData.status = 'shipped';
    }

    order.shipments.push(shipmentData);
    await order.save();

    res.status(200).json({ message: 'Shipment assigned successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning shipment', error: error.message });
  }
};

// Track Shipment
exports.trackShipment = async (req, res) => {
  const { orderId, shipmentId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const shipment = order.shipments.id(shipmentId);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    if (shipment.type === 'shiprocket') {
      const tracking = await shiprocketService.trackShipment(shipment.shiprocket.shipmentId);
      return res.status(200).json({ shipment, tracking });
    }

    res.status(200).json({ shipment, message: 'Manual tracking - use courier link' });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking shipment', error: error.message });
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

// Get all orders for a specific user
exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId, 'payment.status': 'completed' })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};



exports.updateShipmentStatus = async (req, res) => {
  try {
    const { orderId, shipmentId, status } = req.body;

    if (!orderId || !shipmentId || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, "shipments._id": shipmentId },
      {
        $set: {
          "shipments.$.status": status,
        },
        $push: {
          "shipments.$.timeline": {
            status,
            changedAt: new Date(),
          }
        }
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order or Shipment not found" });
    }

    res.json({ message: "Shipment status updated successfully", order });
  } catch (error) {
    console.error("Error updating shipment status:", error);
    res.status(500).json({ message: "Error updating shipment status", error });
  }
};



exports.createShipment = async (req, res) => {
  try {
    const { orderId, items, shipmentType, courierName, trackingId, trackingUrl } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Ensure selected items exist in the order
    const validItemIds = order.items.map(i => i._id.toString());
    const invalidItems = items.filter(id => !validItemIds.includes(id));
    if (invalidItems.length > 0) {
      return res.status(400).json({ message: "Invalid items selected", invalidItems });
    }

    // Add shipment
    order.shipments.push({
      type: shipmentType,
      courierName,
      trackingId,
      trackingUrl,
      items,  // directly saving orderItem._id array
      status: 'pending',
      timeline: [{ status: 'created', changedAt: new Date() }]
    });

    await order.save();

    res.json({ message: "Shipment created successfully", order });
  } catch (error) {
    console.error("Error creating shipment", error);
    res.status(500).json({ message: "Error creating shipment", error: error.message });
  }
};


// controllers/orderController.js
exports.cancelOrderItem = async (req, res) => {
  const { orderId, itemId, cancelledBy } = req.body; // cancelledBy = 'user' or 'admin'
console.log("Cancelling item:", orderId, itemId, cancelledBy);
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, "items._id": itemId },
      {
        $set: {
          "items.$.cancellation": {
            initiated: true,
            cancelledBy,
            status: "requested",
            cancelledAt: new Date(),
          }
        }
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order item not found" });

    res.status(200).json({ message: "Cancellation requested", order });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling item", error: err.message });
  }
};

exports.updateCancellationStatus = async (req, res) => {
  const { orderId, itemId, status } = req.body; // status = confirmed / rejected

  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, "items._id": itemId },
      {
        $set: {
          "items.$.cancellation.status": status,
          ...(status === "confirmed" ? { "items.$.cancellation.cancelledAt": new Date() } : {})
        }
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order item not found" });

    res.status(200).json({ message: `Cancellation ${status}`, order });
  } catch (err) {
    res.status(500).json({ message: "Error updating cancellation", error: err.message });
  }
};


exports.requestReturn = async (req, res) => {
  const { orderId, itemId, reason } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, "items._id": itemId },
      {
        $set: {
          "items.$.return": {
            initiated: true,
            reason,
            status: "requested",
            timeline: [{ status: "requested", changedAt: new Date() }]
          }
        }
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order item not found" });

    res.status(200).json({ message: "Return requested", order });
  } catch (err) {
    res.status(500).json({ message: "Error requesting return", error: err.message });
  }
};

exports.updateReturnStatus = async (req, res) => {
  const { orderId, itemId, status } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, "items._id": itemId },
      {
        $push: { "items.$.return.timeline": { status, changedAt: new Date() } },
        $set: { "items.$.return.status": status }
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order item not found" });

    res.status(200).json({ message: `Return status updated to ${status}`, order });
  } catch (err) {
    res.status(500).json({ message: "Error updating return status", error: err.message });
  }
};

exports.initiateReturn = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id; // from auth middleware

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.return?.initiated) {
      return res.status(400).json({ message: "Return already initiated" });
    }

    // set return info
    item.return = {
      initiated: true,
      reason,
      status: "requested",
      timeline: [{ status: "requested", note: "Return requested by user" }]
    };

    await order.save();

    res.json({ message: "Return initiated successfully", order });
  } catch (error) {
    console.error("Error initiating return:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * Admin updates return status
 */
exports.updateReturnStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status, note, refund } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!item.return || !item.return.initiated) {
      return res.status(400).json({ message: "Return not initiated" });
    }

    // update status
    item.return.status = status;
    item.return.timeline.push({
      status,
      note: note || `Status updated to ${status}`
    });

    // if refund provided
    if (status === "refunded" && refund) {
      item.return.refund = {
        amount: refund.amount,
        refundId: refund.refundId,
        refundedAt: new Date()
      };
    }

    await order.save();

    res.json({ message: "Return status updated successfully", order });
  } catch (error) {
    console.error("Error updating return status:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * Get return timeline for a specific order item
 */
exports.getReturnTimeline = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ return: item.return });
  } catch (error) {
    console.error("Error fetching return timeline:", error);
    res.status(500).json({ message: "Server error" });
  }
};
