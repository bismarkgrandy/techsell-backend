// // // const Product = require("../models/product.model");

// // // // Get all products (approved products only)
// // // const getProducts = async (req, res) => {
// // //   try {
// // //     const products = await Product.find({ status: "approved" }); // Only fetch approved products
// // //     res.status(200).json(products);
// // //   } catch (error) {
// // //     console.error("Error fetching products:", error);
// // //     res.status(500).json({ error: "Internal server error." });
// // //   }
// // // };

// // // // Get product by ID
// // // const getProductById = async (req, res) => {
// // //   try {
// // //     const product = await Product.findById(req.params.id);
// // //     if (!product) {
// // //       return res.status(404).json({ error: "Product not found." });
// // //     }

// // //     if (product.status !== "approved") {
// // //       return res.status(403).json({ error: "Product is not approved yet." });
// // //     }

// // //     res.status(200).json(product);
// // //   } catch (error) {
// // //     console.error("Error fetching product:", error);
// // //     res.status(500).json({ error: "Internal server error." });
// // //   }
// // // };

// // // module.exports = { getProducts, getProductById };

// // export const clearCart = async (req, res) => {
// //     try {
// //       await CartItem.deleteMany({ user: req.user._id });
  
// //       res.json({ message: "Cart emptied successfully" });
// //     } catch (error) {
// //       console.error("Error clearing cart:", error);
// //       res.status(500).json({ message: "Server error" });
// //     }
// //   };
  

// export const removeCartItem = async (req, res) => {
//     try {
//       const { productId } = req.body;
//       const userId = req.user._id;
  
//       await CartItem.deleteOne({ user: userId, product: productId });
  
//       res.json({ message: "Item removed from cart" });
//     } catch (error) {
//       console.error("Error removing cart item:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
  