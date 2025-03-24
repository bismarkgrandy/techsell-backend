import express from "express";
import { protectAdminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { listBarterItem, getBarterItems, delistBarterItem } from "../controllers/barter.controller.js";

const router = express.Router();

router.post("/list-item", protectRoute, listBarterItem);
router.get("/", protectRoute, getBarterItems);
router.patch("/delist/:id", protectRoute, delistBarterItem);





export default router;





