import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      brand,
      category,
      stock,
      isFeatured,
    } = req.body;

    const files = req.files;

    console.log("files", files);

    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let imageUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResponse = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          {
            folder: "products",
          },
        );

        imageUrls.push(uploadResponse.secure_url);
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      brand,
      category,
      stock,
      isFeatured,
      seller: req.user._id,
      images: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object
    const filter = {
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
      filter.brand = brand;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Filter by minimum rating
    if (rating) {
      filter.ratings = {
        $gte: Number(rating),
      };
    }

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "price_asc":
        sortOption.price = 1;
        break;

      case "price_desc":
        sortOption.price = -1;
        break;

      case "rating":
        sortOption.ratings = -1;
        break;

      case "name_asc":
        sortOption.name = 1;
        break;

      case "name_desc":
        sortOption.name = -1;
        break;

      case "oldest":
        sortOption.createdAt = 1;
        break;

      default:
        // Newest first
        sortOption.createdAt = -1;
    }

    // Pagination
    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    // Total matching products
    const totalProducts = await Product.countDocuments(filter);

    // Fetch products
    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("seller", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    return res.status(200).json({
      success: true,
      totalProducts,
      currentPage,
      totalPages: Math.ceil(totalProducts / perPage),
      count: products.length,
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("seller", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      product.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const {
      name,
      description,
      price,
      discountPrice,
      brand,
      category,
      stock,
      isFeatured,
      existingImages,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;

    // Rebuild images: keep the ones the client wants to retain, then upload new files
    let keptImages = [];
    if (existingImages) {
      keptImages = Array.isArray(existingImages) ? existingImages : [existingImages];
    }

    let newImageUrls = [];
    const files = req.files;
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResponse = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );
        newImageUrls.push(uploadResponse.secure_url);
      }
    }

    product.images = [...keptImages, ...newImageUrls];

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      product.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
