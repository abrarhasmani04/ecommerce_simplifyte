import SellerApplication from "../models/sellerApplicationModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import sendEmail from "../services/sendEmail.js";
import User from "../models/userModel.js";

export const applySeller = async (req, res) => {
  try {
    const {
      businessName,
      gstNumber,
      phone,
      aboutBusiness,
    } = req.body;

    // Validate input
    if (!businessName || !gstNumber || !phone || !aboutBusiness) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user is already a seller
    if (req.user.role === "seller") {
      return res.status(400).json({
        success: false,
        message: "You are already a seller",
      });
    }

    // Check if application already exists
    const existingApplication = await SellerApplication.findOne({
      user: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a seller application",
      });
    }

    const admin = await User.findOne({ role: "admin" });

    // Create seller application
    const application = await SellerApplication.create({
      user: req.user._id,
      businessName,
      gstNumber,
      phone,
      aboutBusiness,
    });

     return res.status(201).json({
      success: true,
      message: "Seller application submitted successfully",
      application,
    });

     try {
      await sendEmail(
        admin.email,
        "New Seller Application",
        `
          <h2>New Seller Application</h2>

          <p>A new seller application has been submitted.</p>

          <p><strong>Name:</strong> ${req.user.name}</p>

          <p><strong>Email:</strong> ${req.user.email}</p>

          <p><strong>Business:</strong> ${businessName}</p>

          <p>Please review the application from the admin panel.</p>
        `
      );
    } catch (error) {
      console.log("Email Error:", error.message);
    }

   

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApplicationStatus = async (req, res) => {
  try {
    const application = await SellerApplication.findOne({
      user: req.user._id,
    }).populate("user", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No seller application found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const getSellerDashboard = async (req, res) => {
  try {
    // 1. Find seller's products
    const products = await Product.find({
      seller: req.user._id,
    });

    const productIds = products.map((product) => product._id);

    // 2. Total products
    const totalProducts = products.length;

    // 3. Find orders containing seller's products
    const orders = await Order.find({
      "orderItems.product": {
        $in: productIds,
      },
    });

    let totalOrders = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;
    let totalRevenue = 0;

    // 4. Calculate statistics
    for (const order of orders) {
      totalOrders++;

      if (order.orderStatus === "Pending") {
        pendingOrders++;
      }

      if (order.orderStatus === "Delivered") {
        deliveredOrders++;
      }

      // Count revenue only from paid orders
      if (order.paymentStatus === "Paid") {
        for (const item of order.orderItems) {
          const isSellerProduct = productIds.some(
            (id) => id.toString() === item.product.toString()
          );

          if (isSellerProduct) {
            totalRevenue += item.price * item.quantity;
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      stock,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter
    const filter = {
      seller: req.user._id,
      isActive: true,
    };

    // Search by product name
    if (keyword) {
      filter.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by brand
    if (brand) {
      filter.brand = {
        $regex: brand,
        $options: "i",
      };
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Stock filter
    if (stock) {
      filter.stock = {
        $lte: Number(stock),
      };
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    switch (sort) {
      case "priceAsc":
        sortOption = { price: 1 };
        break;

      case "priceDesc":
        sortOption = { price: -1 };
        break;

      case "nameAsc":
        sortOption = { name: 1 };
        break;

      case "nameDesc":
        sortOption = { name: -1 };
        break;

      case "stockAsc":
        sortOption = { stock: 1 };
        break;

      case "stockDesc":
        sortOption = { stock: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get products
    const products = await Product.find(filter)
      .populate("category", "name")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Total products
    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getSellerOrders = async (req, res) => {
  try {

    // Find seller's products
    const products = await Product.find({
      seller: req.user._id,
    });

    const productIds = products.map((product) =>
      product._id.toString()
    );

    // Find orders containing seller products
    const orders = await Order.find({
      "orderItems.product": {
        $in: productIds,
      },
    })
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate("orderItems.product", "name images seller");

    // Keep only seller's products
    const sellerOrders = orders.map((order) => {

      const sellerItems = order.orderItems.filter((item) => {

        return (
          item.product &&
          item.product.seller.toString() === req.user._id.toString()
        );

      });

      // Calculate seller's revenue in this order
      const sellerTotal = sellerItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      return {
        _id: order._id,

        buyer: order.user,

        shippingAddress: order.shippingAddress,

        paymentStatus: order.paymentStatus,

        orderStatus: order.orderStatus,

        paymentMethod: order.paymentMethod,

        createdAt: order.createdAt,

        sellerTotal,

        orderItems: sellerItems,
      };
    });

    return res.status(200).json({
      success: true,
      totalOrders: sellerOrders.length,
      orders: sellerOrders,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



export const updateSellerOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Valid statuses
    const validStatus = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
    ];

    if (!validStatus.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Find order
   const order = await Order.findById(id)
  .populate("user", "name email")
  .populate("orderItems.product", "seller");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check seller owns at least one product in this order
    const hasSellerProduct = order.orderItems.some(
      (item) =>
        item.product &&
        item.product.seller.toString() === req.user._id.toString()
    );

    if (!hasSellerProduct) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order",
      });
    }

    // Current status
    const currentStatus = order.orderStatus;

    // Allowed transitions
    const statusFlow = {
      Pending: "Confirmed",
      Confirmed: "Processing",
      Processing: "Shipped",
      Shipped: "Delivered",
      Delivered: null,
    };

    // Already delivered
    if (currentStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be updated",
      });
    }

    // Cancelled order
    if (currentStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order cannot be updated",
      });
    }

    // Invalid transition
    if (statusFlow[currentStatus] !== orderStatus) {
      return res.status(400).json({
        success: false,
        message: `Order can only move from ${currentStatus} to ${statusFlow[currentStatus]}`,
      });
    }

    // Update status
    order.orderStatus = orderStatus;

    await order.save();

     return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });


    try {

  // Order Shipped Email
  if (orderStatus === "Shipped") {
    await sendEmail(
      order.user.email,
      "Order Shipped",
      `
      <h2>Your Order Has Been Shipped 🚚</h2>

      <p>Hello ${order.user.name},</p>

      <p>Your order <strong>${order._id}</strong> has been shipped successfully.</p>

      <p>We'll notify you once it is delivered.</p>

      <p>Thank you for shopping with us.</p>
      `
    );
  }

  // Order Delivered Email
  if (orderStatus === "Delivered") {
    await sendEmail(
      order.user.email,
      "Order Delivered",
      `
      <h2>Order Delivered 📦</h2>

      <p>Hello ${order.user.name},</p>

      <p>Your order <strong>${order._id}</strong> has been delivered successfully.</p>

      <p>We hope you enjoy your purchase.</p>

      <p>Please leave a review.</p>
      `
    );
  }

} catch (error) {
  console.log("Email Error:", error.message);
}

   
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getSellerAnalytics = async (req, res) => {
  try {
    // Find seller products
    const products = await Product.find({
      seller: req.user._id,
    });

    const productIds = products.map((product) => product._id);

    // Find orders containing seller products
    const orders = await Order.find({
      "orderItems.product": {
        $in: productIds,
      },
    });

    let totalRevenue = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;

    const customers = new Set();

    const monthlySales = {};

    for (const order of orders) {
      customers.add(order.user.toString());

      if (order.orderStatus === "Pending") {
        pendingOrders++;
      }

      if (order.orderStatus === "Delivered") {
        deliveredOrders++;
      }

      for (const item of order.orderItems) {
        const isSellerProduct = productIds.some(
          (id) => id.toString() === item.product.toString()
        );

        if (
          isSellerProduct &&
          order.paymentStatus === "Paid"
        ) {
          const amount = item.price * item.quantity;

          totalRevenue += amount;

          const month =
            new Date(order.createdAt).getMonth() + 1;

          monthlySales[month] =
            (monthlySales[month] || 0) + amount;
        }
      }
    }

    const monthlySalesArray = Object.keys(monthlySales).map(
      (month) => ({
        month: Number(month),
        revenue: monthlySales[month],
      })
    );

    return res.status(200).json({
      success: true,
      analytics: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: customers.size,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        monthlySales: monthlySalesArray,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};