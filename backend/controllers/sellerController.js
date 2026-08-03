import SellerApplication from "../models/sellerApplicationModel.js";

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