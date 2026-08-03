import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import reviewModel from "../models/reviewModel.js";

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const numReviews = reviews.length;

  const averageRating =
    numReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews
      : 0;

  await Product.findByIdAndUpdate(productId, {
    ratings: averageRating,
    numReviews,
  });
};

export const addReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    // Validate input
    if (!productId || !orderId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find delivered order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      orderStatus: "Delivered",
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Delivered order not found",
      });
    }

    // Check product exists in order
    const purchased = order.orderItems.some(
      (item) => item.product.toString() === productId
    );

    if (!purchased) {
      return res.status(400).json({
        success: false,
        message: "You can review only purchased products",
      });
    }

    // Already reviewed?
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
      order: orderId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product for this order",
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      comment,
    });

    await updateProductRating(productId)

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get reviews
    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalReviews: reviews.length,
      averageRating: product.ratings,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    // Find review
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this review",
      });
    }

    // Update fields
    review.rating = rating;
    review.comment = comment;

    await review.save();

    // Recalculate product rating
    await updateProductRating(review.product);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteReview = async (req, res) => {
  try {
    // Find Review
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Owner/Admin Check
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }

    // Store product id before deleting
    const productId = review.product;

    // Delete Review
    await review.deleteOne();

    // Update Product Rating
    await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};