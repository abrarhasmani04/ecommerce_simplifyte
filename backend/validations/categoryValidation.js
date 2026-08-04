import { body } from "express-validator";

export const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Category name cannot exceed 50 characters"),
];