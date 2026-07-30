import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Address from "../models/addressModel.js";


export const placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;

    // 1. Find Address
    const address = await Address.findOne({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // 2. Get User Cart
    const cartItems = await Cart.find({
      user: req.user._id,
    }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let orderItems = [];
    let itemsPrice = 0;

    // 3. Prepare Order Items
    for (const item of cartItems) {
      const product = item.product;

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || null,
        price: product.discountPrice || product.price,
        quantity: item.quantity,
      });

      itemsPrice +=
        (product.discountPrice || product.price) * item.quantity;
    }

    const shippingPrice = 0;
    const taxPrice = 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // 4. Create Order
    const order = await Order.create({
      user: req.user._id,
      orderItems,

      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
        addressType: address.addressType,
      },

      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,

      paymentMethod,
    });

    // 5. Reduce Stock
    for (const item of cartItems) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // 6. Clear Cart
    await Cart.deleteMany({
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  }
 catch (error) {
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};