import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addToCart, getCartItems, updateCartItem, removeCartItem, clearCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", protectRoute, addToCart);
router.get("/", protectRoute , getCartItems);
router.patch("/update/:id", protectRoute, updateCartItem);
router.delete("/delete/:id", protectRoute, removeCartItem );
router.delete("/delete", protectRoute, clearCart)





export default router;