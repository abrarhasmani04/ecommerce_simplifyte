import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { addReview,getProductReviews,deleteReview,updateReview } from "../controllers/reviewController.js";

const reviewRoute = express.Router();

reviewRoute.post("/", authMiddleware, addReview);
reviewRoute.get('/:productId',getProductReviews)
reviewRoute.put('/:id',authMiddleware,updateReview)
reviewRoute.delete('/:id',authMiddleware,deleteReview)



export default reviewRoute;