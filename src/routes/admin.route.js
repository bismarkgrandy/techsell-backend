import express from "express";
import { protectAdminRoute } from "../middleware/auth.middleware.js";
import { getPendingProducts, approveProduct, approveSeller, approveDeliveryPersonnel, getApprovedDeliveryPersonnel, getDeliveryCounts, getPendingDeliveryPersonnels, getPendingSellers, adminDelistBarterItem } from "../controllers/admin.controller.js";


const router = express.Router();

router.get("/products/pending", protectAdminRoute, getPendingProducts);
router.patch("/product/:id", protectAdminRoute, approveProduct);
router.patch("/approve-seller/:id", protectAdminRoute, approveSeller);
router.patch("/approve/delivery-personnel/:id", protectAdminRoute, approveDeliveryPersonnel);
router.get("/approved-delivery-personnel",protectAdminRoute, getApprovedDeliveryPersonnel);
router.get("/delivery-counts", protectAdminRoute, getDeliveryCounts);
router.get("/pending-delivery-personnel", protectAdminRoute, getPendingDeliveryPersonnels);
router.get("/pending-seller", protectAdminRoute, getPendingSellers);
router.delete("/admin-delist-barter/:id", protectAdminRoute, adminDelistBarterItem );





export default router;