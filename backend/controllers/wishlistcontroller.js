import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }

    // Add to wishlist
    const wishlist = await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user._id,
    })
      .populate({
        path: "product",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalItems: wishlist.length,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find wishlist item
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    // Remove wishlist item
    await wishlist.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};