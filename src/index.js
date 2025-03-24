import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import axios from "axios";
import cors from "cors";


import { connectDB } from "./lib/db.js";




import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import adminRoutes from "./routes/admin.route.js";
import barterRoutes from "./routes/barter.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";


dotenv.config();


const app = express();

const PORT=process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }))
app.use(
    cors({
      origin: ["https://techsell-frontend.onrender.com"], // Allow frontend URL
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Include PATCH here
      credentials: true, // Allow cookies and authentication headers
    })
  );

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/barter", barterRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes)

// const PAYSTACK_SECRET_KEY = "sk_test_38f3ac7a6f621095b1a462f7e347f01b672acc20"; // Replace with your secret key

// const paystack = axios.create({
//   baseURL: "https://api.paystack.co",
//   headers: {
//     Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//     "Content-Type": "application/json",
//   },
// });

// app.post("/initialize", async (req, res) => {
//     try {
//       const { email, amount } = req.body;
      
//       if (!email || !amount) {
//         return res.status(400).json({ error: "Email and amount are required" });
//       }
  
//       const response = await paystack.post("/transaction/initialize", {
//         email,
//         amount: amount * 100, // Convert to kobo (Paystack uses kobo, 100 kobo = 1 GHS)
//         callback_url: "https://yourwebsite.com/verify-payment", // Replace with your frontend callback URL
//       });
  
//       res.json(response.data);
//     } catch (error) {
//       res.status(500).json({ error: error.response?.data || "Payment initialization failed" });
//     }
//   });
  


app.listen(PORT ,()=>{
    connectDB();
    console.log("The server just started on port 3000");
})