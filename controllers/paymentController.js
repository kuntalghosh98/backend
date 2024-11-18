const Razorpay = require('razorpay');
const crypto = require('crypto');

// Create Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
exports.createOrder = async (req, res) => {
  const { amount, currency } = req.body;
console.log("controller",amount)
  try {
    const options = {
      amount: Math.round(amount * 100), // Razorpay takes the amount in paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    console.log(options)

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Razorpay order', error });
  }
};

// Verify payment signature after successful payment
exports.verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature)

  // Signature verification
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
console.log("signature",expectedSignature);
  if (expectedSignature === razorpay_signature) {
    res.status(200).json({success:true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid payment signature' });
  }
};
