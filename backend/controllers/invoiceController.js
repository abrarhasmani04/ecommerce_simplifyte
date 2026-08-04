import generateInvoice from "../utils/generateInvoice.js";
import Order from "../models/orderModel.js";

export const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    generateInvoice(order, res);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};