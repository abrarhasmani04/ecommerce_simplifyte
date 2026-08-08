import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import { resetPassword } from "./authController.js";
import sendEmail from "../services/sendEmail.js";

import SellerApplication from "../models/sellerApplicationModel.js";


export const getDashboard = async (req, res) => {
  try {

    // Users
    const totalUsers = await User.countDocuments();

    // Products
    const totalProducts = await Product.countDocuments();

    // Orders
    const totalOrders = await Order.countDocuments();

    // Order Status
    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const processingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });

    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });

    // Low Stock (<10)
    const lowStockProducts = await Product.countDocuments({
      stock: {
        $lt: 10,
      },
    });

    // Revenue
    const revenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue =
      revenue.length > 0 ? revenue[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        lowStockProducts,
        totalRevenue,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const getRecentOrders = async (req, res) => {

  try {
        const recentOrders = await Order.find()
    .populate('user','name email')
   .populate({
        path: "orderItems.product",
        select:"name images price seller",
        populate: {
          path: "seller",
          select: "name email",
        },
      })
    
    .sort({createAt: -1})
    .limit(7)

    res.status(200).json({
      success: true,
      count: recentOrders.length,
      recentOrders
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }

}

export const getAllOrders = async (req, res) => {

    try{
const recentOrders = await Order.find()
      .populate("user", "name email")
      .populate({
        path: "orderItems.product",
        select:"name images price seller",
        populate: {
          path: "seller",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recentOrders.length,
      recentOrders
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }

}


export const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Sellers fetched successfully",
      count: sellers.length,
      sellers,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getLowStock = async (req,res)=>{
  try{
    const lowStockProducts = await Product.find({
        stock:{$lt:10},
        isActive:true
    })
    .populate('category','name ')
    .select('name brand stock price images category')
    .sort({stock:1})

    return res.status(200).json({
      success: true,
      message: "Sellers fetched successfully",
      count: sellers.length,
      sellers,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      stock: { $lt: 10 },
      isActive: true,
    })
      .populate("category", "name")
      .select("name brand stock price images category")
      .sort({ stock: 1 });

    return res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      products: lowStockProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMonthlySales = async (req, res) => {
  try {

    const monthlySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          totalOrders: {
            $sum: 1,
          },
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      monthlySales,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting admin
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin account cannot be deleted",
      });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          orderStatus: { $ne: "Cancelled" },
        },
      },

      {
        $unwind: "$orderItems",
      },

      {
        $group: {
          _id: "$orderItems.product",

          totalSold: {
            $sum: "$orderItems.quantity",
          },
        },
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);

    // Populate product details
    const products = await Product.populate(topProducts, {
      path: "_id",
      select: "name brand images price stock",
    });

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



export const getTopCategories = async (req, res) => {
  try {
    const topCategories = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          orderStatus: { $ne: "Cancelled" },
        },
      },

      {
        $unwind: "$orderItems",
      },

      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },

      {
        $group: {
          _id: "$product.category",

          totalSold: {
            $sum: "$orderItems.quantity",
          },
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: "$category",
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      success: true,
      topCategories,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};





export const updateSellerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    // Validate status
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Approved or Rejected",
      });
    }

    // Find application
    const application = await SellerApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Seller application not found",
      });
    }

    // Application already processed
    if (application.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Application is already ${application.status.toLowerCase()}`,
      });
    }

    // Find user
    const user = await User.findById(application.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Approve
    if (status === "Approved") {
      application.status = "Approved";
      application.rejectionReason = "";

      user.role = "seller";
    }

    // Reject
    if (status === "Rejected") {
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      application.status = "Rejected";
      application.rejectionReason = rejectionReason;
    }

    await application.save();
    await user.save();

     return res.status(200).json({
      success: true,
      message: `Seller application ${status.toLowerCase()} successfully`,
      application,
    });


    // Send email
    try {
      if (status === "Approved") {
        console.log("Status:", status);
        console.log("User Email:", user.email);
        console.log("User Name:", user.name);
        await sendEmail(
          user.email,
          "Seller Application Approved",
          `
      <h2>Congratulations 🎉</h2>

      <p>Hello ${user.name},</p>

      <p>Your seller application has been approved.</p>

      <p>You can now login as a Seller and start selling products.</p>

      <p>Happy Selling!</p>
      `
        );
      }

      if (status === "Rejected") {
        await sendEmail(
          user.email,
          "Seller Application Rejected",
          `
      <h2>Seller Application Rejected</h2>

      <p>Hello ${user.name},</p>

      <p>Unfortunately, your seller application has been rejected.</p>

      <p><strong>Reason:</strong> ${rejectionReason}</p>

      <p>You can update your details and apply again.</p>
      `
        );
      }
    } catch (error) {
      console.log("Email Error:", error.message);
    }


    return res.status(200).json({
      success: true,
      message: `Seller application ${status.toLowerCase()} successfully`,
      application,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSellerApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const applications = await SellerApplication.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role isVerified createdAt");

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      users,
    });

  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

