import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
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

    // Check if product already exists in user's cart
    const existingCartItem = await Cart.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity || 1;

      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cart: existingCartItem,
      });
    }

    // Create new cart item
    const cartItem = await Cart.create({
      user: req.user._id,
      product: productId,
      quantity: quantity || 1,
    });

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart: cartItem,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({
      user: req.user._id,
    }).populate("product");

    res.status(200).json({
      success: true,
      totalItems: cartItems.length,
      cart: cartItems,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cartItem = await Cart.findOne({
      _id: req.params.id,
       user: req.user._id,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cartItem.quantity = quantity;

    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: cartItem,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await cartItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAllCart = async (req, res) => {
  try {
    const result = await Cart.deleteMany({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      deletedItems: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};