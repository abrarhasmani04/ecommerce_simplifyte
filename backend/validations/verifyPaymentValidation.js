import { body } from "express-validator";

export const verifyPaymentValidation = [
  body("razorpay_order_id")
    .notEmpty()
    .withMessage("Razorpay Order ID is required"),

  body("razorpay_payment_id")
    .notEmpty()
    .withMessage("Razorpay Payment ID is required"),

  body("razorpay_signature")
    .notEmpty()
    .withMessage("Razorpay Signature is required"),
];