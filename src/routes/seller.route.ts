import express from "express";
import SellerController from "../controllers/seller.controller";
import { authenticateSeller } from "../middlewares/authenticate-seller.middleware";

const router = express.Router();
const sellerController = new SellerController();

// Public routes
router.post("/register", sellerController.register);
router.post("/login", sellerController.login);
router.post("/verify-otp", sellerController.verifyOtp);
router.post("/resend-otp", sellerController.resendOtp);

// Protected routes (require authentication)
router.get("/profile", authenticateSeller, sellerController.getProfile);
router.put("/profile", authenticateSeller, sellerController.updateProfile);
router.post(
	"/change-password",
	authenticateSeller,
	sellerController.changePassword
);
router.post("/logout", authenticateSeller, sellerController.logout);
router.delete("/account", authenticateSeller, sellerController.deleteAccount);

export default router;
