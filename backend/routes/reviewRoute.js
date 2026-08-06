import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { addReview,getProductReviews,deleteReview,updateReview } from "../controllers/reviewController.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { reviewValidation } from "../validations/reviewValidation.js";
import { updateCartValidation } from "../validations/updateCartValidation.js";
import { updateReviewValidation } from "../validations/updateReviewValidation.js";
const reviewRoute = express.Router();

reviewRoute.post("/", authMiddleware,reviewValidation,validationMiddleware, addReview);
reviewRoute.get('/:productId',getProductReviews)
reviewRoute.put('/:id',authMiddleware,updateReviewValidation,validationMiddleware,updateReview)
reviewRoute.delete('/:id',authMiddleware,deleteReview)



export default reviewRoute;