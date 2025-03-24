import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { paystackWebhook, placeOrder, markOrderAsDelivered, getUserOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/place-order", protectRoute, placeOrder );
router.post("/paystack-webhook",paystackWebhook);
router.patch("/confirm-delivery", protectRoute, markOrderAsDelivered);
router.get("/my-orders", protectRoute, getUserOrders)













export default router;