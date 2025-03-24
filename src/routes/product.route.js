import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { listProduct, getApprovedProducts, getProductById, filterProducts, getFeaturedProducts} from "../controllers/product.controller.js";

const router = express.Router();


router.post("/list-product", protectRoute, listProduct);
router.get("/", protectRoute, getApprovedProducts );
router.get("/search", protectRoute , filterProducts);
router.get("/featured", protectRoute, getFeaturedProducts);
router.get("/:id",protectRoute, getProductById);







export default router;
