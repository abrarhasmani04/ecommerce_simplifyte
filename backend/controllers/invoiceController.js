import generateInvoice from "../utils/generateInvoice.js";
import Order from "../models/orderModel.js";

export const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate(
      "user",
      "name email"
    );

    // Check order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Authorization
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Invoice only for delivered orders
    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Invoice can only be downloaded after the order is delivered.",
      });
    }

    // Generate Invoice
    generateInvoice(order, res);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};