import express from "express";
import {signup, login , logout, verifyOtpAndRegister, resendOtp, getUserInfo, requestSellerRole, requestDeliveryRole} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/signup", signup)

router.post("/verify-otp", verifyOtpAndRegister);

router.post("/resend-otp", resendOtp)

router.post("/login", login);

router.post("/logout", logout);

router.get("/user/me",protectRoute,getUserInfo);

router.post("/become-seller", protectRoute , requestSellerRole);

router.post("/become-delivery", protectRoute, requestDeliveryRole);








export default router;