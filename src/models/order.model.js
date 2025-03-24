import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Track seller
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true }, // Includes delivery fee
    status: {
      type: String,
      enum: ["pending", "processing", "delivered"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    transactionRef: { type: String, default: null }, // Paystack transaction reference
    deliveryPersonnel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Admin assigns later
    },
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
