import Order from "../models/order.model.js";
import CartItem from "../models/cart.model.js";

import axios from "axios";


export const placeOrder = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Step 1: Fetch Cart Items
      const cartItems = await CartItem.find({ user: userId }).populate("product");
  
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Your cart is empty. Add items before placing an order." });
      }
  
      // Step 2: Prepare Order Data
      let totalAmount = 0;
      const orderItems = cartItems.map((item) => {
        totalAmount += item.quantity * item.product.price;
        return {
          product: item.product._id,
          seller: item.product.seller, // Store seller reference
          quantity: item.quantity,
          price: item.product.price,
        };
      });
  
      // Step 3: Add Delivery Fee (10 GHS)
      totalAmount += 10;
  
      // Step 4: Create Order (Pending Payment)
      const newOrder = new Order({
        user: userId,
        items: orderItems,
        totalAmount,
        status: "pending",
        paymentStatus: "pending",
      });
  
      await newOrder.save();
  
      // Step 5: Clear Cart After Order Creation
      await CartItem.deleteMany({ user: userId });
  
      // Step 6: Initialize Paystack Payment
      const paystackResponse = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: req.user.studentEmail,
          amount: totalAmount * 100, // Convert to kobo (smallest unit in Paystack)
          currency: "GHS",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Attach Transaction Reference to Order
      newOrder.transactionRef = paystackResponse.data.data.reference;
      const order = await newOrder.save();
  
      res.status(201).json({
        message: "Order placed. Proceed to payment.",
        order,
        paystackUrl: paystackResponse.data.data.authorization_url,
      });
  
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

export const paystackWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const transactionRef = event.data.reference;
      const order = await Order.findOne({ transactionRef });

      if (order) {
        order.paymentStatus = "paid";
        order.status = "processing"; // Order processing starts after payment
        await order.save();
      }
    }

    res.sendStatus(200); // Acknowledge webhook
  } catch (error) {
    console.error("Paystack Webhook Error:", error);
    res.sendStatus(500);
  }
};

export const markOrderAsDelivered = async (req, res) => {
    try {
      const { orderId, deliveryPersonnelId } = req.body;
      const userId = req.user._id; // Authenticated buyer
  
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });
  
      // Ensure only the buyer can confirm delivery
      if (order.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized: Only the buyer can confirm delivery" });
      }
  
      if (order.status === "delivered") {
        return res.status(400).json({ message: "Order is already marked as delivered" });
      }

      if (order.paymentStatus!== "paid") {
        return res.status(400).json({message: "You have not paid for this order"})
      }
  
      // Update order with delivery personnel (only if not already set)
      if (!order.deliveryPersonnel) {
        order.deliveryPersonnel = deliveryPersonnelId;
      }
  
      order.status = "delivered";
      order.deliveredAt = new Date();
      await order.save();
  
      res.json({ message: "Order marked as delivered", order });
    } catch (error) {
      console.error("Error marking order as delivered:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id; // Get logged-in user ID from auth middleware

        const orders = await Order.find({ user: userId })
            .populate({
                path: "items.product",
                select: "name price", // Populate only name and price
            })
            .select("_id items status paymentStatus deliveryPersonnel");

        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};
