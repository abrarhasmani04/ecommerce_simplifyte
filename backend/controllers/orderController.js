import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Address from "../models/addressModel.js";
import sendEmail from "../services/sendEmail.js";


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

    try {
  await sendEmail(
    req.user.email,
    "Order Confirmation - TrendWave",
    `
      <h2>Order Confirmed 🎉</h2>

      <p>Hello ${req.user.name},</p>

      <p>Your order has been placed successfully.</p>

      <p><strong>Order ID:</strong> ${order._id}</p>

      <p><strong>Total Amount:</strong> Rs. ${order.totalPrice}</p>

      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

      <p>Thank you for shopping with <strong>TrendWave</strong>.</p>
    `
  );
} catch (emailError) {
  console.error("Order Email Error:", emailError.message);
}
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
      .populate("user", "name email").populate('orderItems.product',"name images price")
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

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only owner or admin can view the order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only the owner can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order",
      });
    }

    // Cannot cancel after shipping
    if (
      order.orderStatus === "Shipped" ||
      order.orderStatus === "Delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${order.orderStatus} and cannot be cancelled`,
      });
    }

    // Already cancelled
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    // Restore stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "Cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
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

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate({ path: 'orderItems.product', select: 'seller' });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Block: if every product in this order was uploaded by a seller (role !== admin),
    // the admin cannot update the status — only the seller manages their own orders.
    const allBelongToSellers = order.orderItems.every((item) => {
      const sellerUser = item.product?.seller;
      return sellerUser && sellerUser.toString() !== req.user._id.toString();
    });

    if (allBelongToSellers) {
      return res.status(403).json({
        success: false,
        message: "You cannot update the status of orders belonging to other sellers",
      });
    }

    // Prevent updates after cancellation
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order cannot be updated",
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "Delivered") {
      order.deliveredAt = new Date();

      // Optional: mark COD payment as paid
      if (
        order.paymentMethod === "COD" &&
        order.paymentStatus === "Pending"
      ) {
        order.paymentStatus = "Paid";
        order.paidAt = new Date();
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};