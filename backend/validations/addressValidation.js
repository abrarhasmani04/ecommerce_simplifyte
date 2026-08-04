import { body } from "express-validator";

export const addressValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Full name must be between 3 and 50 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10-digit phone number"),

  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Address Line 1 must be between 5 and 100 characters"),

  body("addressLine2")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Address Line 2 cannot exceed 100 characters"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required")
    .matches(/^\d{6}$/)
    .withMessage("Postal code must be 6 digits"),

  body("addressType")
    .notEmpty()
    .withMessage("Address type is required")
    .isIn(["Home", "Office", "Other"])
    .withMessage("Address type must be Home, Office or Other"),
];