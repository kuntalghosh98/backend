// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const Payment = require('../models/Payment');

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// Create Razorpay Order
// exports.createOrder = async (req, res) => {
//   const { amount, currency = 'INR' } = req.body;

//   try {
//     const options = {
//       amount: Math.round(amount * 100), // Razorpay uses paise
//       currency,
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);
//     res.status(200).json(order);
//   } catch (error) {
//     console.error('Razorpay order error:', error);
//     res.status(500).json({ message: 'Error creating Razorpay order', error });
//   }
// };





// // Verify Payment Signature & Save
// exports.verifyPayment = async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     amount,
//     currency,
//     userId,
//   } = req.body;

//   try {
//     const generatedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');

//     if (generatedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: 'Invalid payment signature' });
//     }

//     const payment = new Payment({
//       orderId: razorpay_order_id,
//       paymentId: razorpay_payment_id,
//       signature: razorpay_signature,
//       amount,
//       currency,
//       status: 'completed',
//       userId,
//     });

//     await payment.save();

//     res.status(200).json({ success: true, message: 'Payment verified and saved', payment });
//   } catch (error) {
//     console.error('Payment verification failed:', error);
//     res.status(500).json({ message: 'Payment verification failed', error });
//   }
// };




const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const { sendPaymentSuccessEmail } = require('../utils/emailSender');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE Razorpay Order (SECURED: token + server-side amount calc)
exports.createOrder = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Cannot proceed to payment.' });
    }

    // ✅ Calculate total amount from cart
    let totalCartPrice = cart.items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    const deliveryCharge = totalCartPrice > 100 ? 0 : 10;
    const totalAmount = Math.round((totalCartPrice + deliveryCharge) * 100); // paise

    const options = {
      amount: totalAmount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay createOrder error:', error);
    res.status(500).json({ message: 'Error creating Razorpay order', error });
  }
};

// ✅ VERIFY Razorpay Payment (SECURED: token)
exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency,
  } = req.body;

  const userId = req.user._id;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const payment = new Payment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount,
      currency,
      status: 'completed',
      userId,
    });

    await payment.save();
    if (req.user?.email) {
      try {
        await sendPaymentSuccessEmail(req.user.email, razorpay_order_id, amount);
      } catch (emailErr) {
        console.error('Failed to send confirmation email:', emailErr.message);
      }
    }
    res.status(200).json({
      success: true,
      message: 'Payment verified and saved successfully',
      payment,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error });
  }
};
