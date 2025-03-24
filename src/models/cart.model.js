import mongoose from "mongoose";

import Product from "./product.model.js";
import User from "./user.model.js";

const cartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  addedAt: { type: Date, default: Date.now }
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
