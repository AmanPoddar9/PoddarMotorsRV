const Razorpay = require('razorpay');
const crypto = require('crypto');
const InspectionBooking = require('../models/InspectionBooking');

// Initialize Razorpay
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay initialized');
} else {
  console.warn('⚠️  Razorpay credentials not configured. Payment features will be disabled.');
}

// Create Razorpay order for inspection payment
exports.createInspectionOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ 
        error: 'Payment service unavailable',
        message: 'Razorpay not configured'
      });
    }

    const { bookingId, amount } = req.body;

    // Verify booking exists
    const booking = await InspectionBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise (₹499 = 49900 paise)
      currency: 'INR',
      receipt: `inspection_${bookingId}`,
      notes: {
        bookingId: bookingId,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        carDetails: `${booking.brand} ${booking.model} (${booking.registrationNumber})`
      }
    };

    const order = await razorpay.orders.create(options);

    // Update booking with order ID
    booking.orderId = order.id;
    await booking.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ 
      error: 'Failed to create payment order',
      message: error.message 
    });
  }
};

// Verify Razorpay payment signature
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId 
    } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid payment signature' 
      });
    }

    // Update booking status
    const booking = await InspectionBooking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'Paid',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'Confirmed'
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        error: 'Booking not found' 
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      booking
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false,
      error: 'Payment verification failed',
      message: error.message 
    });
  }
};

// Handle payment failure
exports.paymentFailed = async (req, res) => {
  try {
    const { bookingId, error } = req.body;

    const booking = await InspectionBooking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'Failed',
        status: 'Pending'
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Payment failure recorded',
      booking
    });

  } catch (error) {
    console.error('Error handling payment failure:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ error: 'Payment service unavailable' });
    }

    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount / 100, // Convert paise to rupees
      method: payment.method,
      captured: payment.captured
    });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
};
