import { body } from "express-validator";

export const placeOrderValidation = [
  body("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid Address ID"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["COD", "Razorpay"])
    .withMessage("Payment method must be COD or ONLINE"),
];