import { body } from "express-validator";
export const updateSellerApplicationValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Approved", "Rejected"])
    .withMessage("Status must be Approved or Rejected"),

  body("rejectionReason")
    .if(body("status").equals("Rejected"))
    .notEmpty()
    .withMessage("Rejection reason is required")
    .isLength({ min: 5, max: 300 })
    .withMessage("Rejection reason must be between 5 and 300 characters"),
];