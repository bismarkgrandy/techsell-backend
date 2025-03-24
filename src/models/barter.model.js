import mongoose from "mongoose";

import User from "./user.model.js";

const barterItemSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: { 
    type: String, required:true
 },
  wantedItemDescription: {
    type: String,
    required: true,
    maxlength: 50, // Enforce max length of 50 characters
  },
  phone:{
    type:String,
    required:true,
    minlength: 10, // Enforces minimum length of 10
    maxlength: 10, // Enforces maximum length of 10
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"], // Ensures only 10 digits
  },
  status: {
    type: String,
    enum: ["active", "delisted"],
    default: "active",
  },
}, { timestamps: true });

const BarterItem = mongoose.model("BarterItem", barterItemSchema);

export default BarterItem;
