import Product from "../models/product.model.js";
import User from "../models/user.model.js";

import cloudinary from "../lib/cloudinary.js";

export const listProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, description, price, image, category } = req.body;

    // Check if the user is a verified seller
    const user = await User.findById(userId);
    if (!user || !user.roles.includes("seller") || user.sellerStatus !== "approved") {
      return res.status(403).json({ error: "You are not authorized to list products." });
    }

    const uploadImageResponse = await cloudinary.uploader.upload(image);

    // Create new product with pending status
    const product = new Product({
      seller: userId,
      name,
      description,
      price,
      image:uploadImageResponse.secure_url,
      category,
      status: "pending"
    });

    await product.save();

    res.status(201).json({
      message: "Your product listing request has been submitted for review.",
      product
    });
  } catch (error) {
    console.error("Error listing product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (product.status !== "approved") {
      return res.status(403).json({ error: "Product is not approved yet." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getApprovedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12; // Default 10 products per page
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const products = await Product.find({ status: "approved" })
      .skip(skip)
      .limit(limit);

      if (products.length === 0) {
        return res.status(200).json({ message: "No more products.", products: [] });
      }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching approved products:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, status: "approved" });

    if (products.length === 0) {
      return res.status(200).json({ message: "No featured products available.", products: [] });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};



export const filterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, keyword } = req.query;

    let filters = { status: "approved" }; // Only show approved products

    // ✅ Filter by category
    if (category) filters.category = category;

    // ✅ Filter by price range
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice); // Min price
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice); // Max price
    }

    // ✅ Search by keyword (name or description)
    if (keyword) {
      filters.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // 🔍 Fetch products from database
    const products = await Product.find(filters);

    // ⚠️ If no products match the search, return a message
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


