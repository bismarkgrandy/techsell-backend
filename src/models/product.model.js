import mongoose from "mongoose";
import User from "./user.model.js";

const ProductSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required:true }, 
  category: { type: String, required: true },
  featured: {type:String, enum: [true, false], default: false},
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

export default Product;
