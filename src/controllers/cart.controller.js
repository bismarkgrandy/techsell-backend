import CartItem from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";


  export const getCartItems = async (req, res) => {
    try {
      const cartItems = await CartItem.find({ user: req.user._id }).populate("product", "name price image seller");
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const addToCart = async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.user._id;
  
      let cartItem = await CartItem.findOne({ user: userId, product: productId });
  
      if (cartItem) {
        cartItem.quantity += 1;  // Increase quantity if already in cart
      } else {
        cartItem = new CartItem({ user: userId, product: productId, quantity: 1 });
      }
  
      await cartItem.save();
      res.json({ message: "Item added to cart", cartItem });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  

  // export const updateCartItem = async (req, res) => {
  //   try {
  //     const { id: productId} = req.params; // ✅ Get product ID, not cartItem ID
  //     const { quantity } = req.body;
  //     const userId = req.user._id;
  
  //     let cartItem = await CartItem.findOne({ user: userId, product: productId });
  
  //     if (!cartItem) {
  //       return res.status(404).json({ message: "Cart item not found." });
  //     }
  
  //     if (quantity <= 0) {
  //       await CartItem.deleteOne({ _id: cartItem._id });
  //       return res.json({ message: "Item removed from cart" });
  //     }
  
  //     cartItem.quantity = quantity;
  //     await cartItem.save();
  
  //     res.json({ message: "Cart updated successfully", cartItem });
  //   } catch (error) {
  //     console.error("Error updating cart item:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // };

  export const updateCartItem = async (req, res) => {
    try {
      const { id:cartItemId } = req.params; // ✅ Use cartItemId, not productId
      const { quantity } = req.body;
      const userId = req.user._id;
  
      if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
        return res.status(400).json({ message: "Invalid cart item ID." });
      }
  
      let cartItem = await CartItem.findOne({ _id: cartItemId, user: userId });
  
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found." });
      }
  
      if (quantity <= 0) {
        await CartItem.deleteOne({ _id: cartItem._id });
        return res.json({ message: "Item removed from cart" });
      }
  
      cartItem.quantity = quantity;
      await cartItem.save();
  
      res.json({ message: "Cart updated successfully", cartItem });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // export const removeCartItem = async (req, res) => {
  //   try {
  //     const { id:productId } = req.body;
  //     const userId = req.user._id;
  
  //     const deletedItem = await CartItem.deleteOne({ user: userId, product: productId });
  //     console.log(deletedItem);
  
  //     res.json({ message: "Item removed from cart" });
  //   } catch (error) {
  //     console.error("Error removing cart item:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // };


  export const removeCartItem = async (req, res) => {
    try {
      const {id : cartItemId } = req.params;
      const userId = req.user._id;
  
      if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
        return res.status(400).json({ message: "Invalid cart item ID." });
      }
  
      const cartItem = await CartItem.findOne({ _id: cartItemId, user: userId });
  
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found." });
      }
  
      await CartItem.deleteOne({ _id: cartItem._id });
  
      res.json({ message: "Item removed from cart successfully" });
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const clearCart = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const deletedItems = await CartItem.deleteMany({ user: userId });
  
      if (deletedItems.deletedCount === 0) {
        return res.status(404).json({ message: "No cart items found to remove." });
      }
  
      res.json({ message: "All cart items removed successfully" });
    } catch (error) {
      console.error("Error removing all cart items:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  