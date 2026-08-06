import { body } from "express-validator";

export const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("price")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Price must be greater than 0"),

  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price cannot be negative"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),

  body("brand")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Brand cannot be empty"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID"),
];