const crypto = require('crypto');
const Payment = require('../models/Payment');

exports.handleRazorpayWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const receivedSignature = req.headers['x-razorpay-signature'];
  const body = req.body;

  // Validate signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(body))
    .digest('hex');

  if (receivedSignature !== expectedSignature) {
    return res.status(400).json({ message: 'Invalid Razorpay webhook signature' });
  }

  try {
    const event = body.event;

    if (event === 'payment.captured') {
      const payment = body.payload.payment.entity;

      // Check if already recorded
      const existing = await Payment.findOne({ paymentId: payment.id });

      if (!existing) {
        const newPayment = new Payment({
          orderId: payment.order_id,
          paymentId: payment.id,
          amount: payment.amount / 100, // Razorpay uses paise
          currency: payment.currency,
          status: 'completed',
          signature: 'webhook',
          userId: null, // Optional: You can resolve this using order metadata if needed
        });

        await newPayment.save();
        console.log('✅ Webhook: Payment saved to DB:', payment.id);
      } else {
        console.log('ℹ️ Webhook: Payment already exists:', payment.id);
      }
    }

    // You can handle more events like payment.failed, order.paid etc. here

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Razorpay webhook error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
