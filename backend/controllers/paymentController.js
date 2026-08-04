import Order from "../models/orderModel.js";
import razorpay from "../utils/razorpay.js";
import crypto from 'crypto'
import sendEmail from '../services/sendEmail.js';


export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 2. Check ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 3. Already paid?
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order already paid",
      });
    }

    // 4. Razorpay options
    const options = {
      amount: order.totalPrice * 100, // in paise
      currency: "INR",
      receipt: order._id.toString(),
      notes: {
         orderId: order._id.toString(),
  },
    };

    // 5. Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    // 6. Save Razorpay Order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    

    // 7. Response
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrder,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 1. Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 2. Compare signatures
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // 3. Find order
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 4. Save payment details
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    order.paymentStatus = "Paid";
    order.paidAt = new Date();

    await order.save();
    try {
  await sendEmail(
    req.user.email,
    "Payment Successful",
    `
      <h2>Payment Successful 🎉</h2>

      <p>Hello ${req.user.name},</p>

      <p>Your payment has been received.</p>

      <p>Order ID: ${order._id}</p>

      <p>Total: ₹${order.totalPrice}</p>
    `
  );
} catch (error) {
  console.log(error.message);
}

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};