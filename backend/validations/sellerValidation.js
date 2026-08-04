import { body } from "express-validator";

export const sellerApplicationValidation = [
  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Business name must be between 3 and 100 characters"),

  body("gstNumber")
    .optional()
    .trim()
    .isLength({ min: 15, max: 15 })
    .withMessage("GST number must be 15 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10-digit phone number"),

  body("aboutBusiness")
    .trim()
    .notEmpty()
    .withMessage("About business is required")
    .isLength({ min: 20, max: 500 })
    .withMessage("About business must be between 20 and 500 characters"),
];