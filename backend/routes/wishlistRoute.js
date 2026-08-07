import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
// import { addToWishlist,removeFromWishlist,getMyWishlist } from "../controllers/wishlistController.js";
import { addToWishlist,removeFromWishlist,getMyWishlist } from "../controllers/wishlistcontroller.js";

const wishlistRoute = express.Router();

wishlistRoute.post("/:productId", authMiddleware, addToWishlist);
wishlistRoute.get('/',authMiddleware,getMyWishlist)
wishlistRoute.delete('/:productId',authMiddleware,removeFromWishlist)
export default wishlistRoute;