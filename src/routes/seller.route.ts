import express from "express";
import SellerController from "../controllers/seller.controller";
import { authenticateSeller } from "../middlewares/authenticate-seller.middleware";

const router = express.Router();
const sellerController = new SellerController();

// Public routes
router.post("/register", sellerController.register.bind(sellerController));
router.post("/login", sellerController.login.bind(sellerController));
router.post("/verify-otp", sellerController.verifyOtp.bind(sellerController));
router.post("/resend-otp", sellerController.resendOtp.bind(sellerController));

// Protected routes (require authentication)
router.get(
	"/profile",
	authenticateSeller,
	sellerController.getProfile.bind(sellerController)
);
router.put(
	"/profile",
	authenticateSeller,
	sellerController.updateProfile.bind(sellerController)
);
router.post(
	"/change-password",
	authenticateSeller,
	sellerController.changePassword.bind(sellerController)
);
router.post(
	"/logout",
	authenticateSeller,
	sellerController.logout.bind(sellerController)
);
router.delete(
	"/account",
	authenticateSeller,
	sellerController.deleteAccount.bind(sellerController)
);

// controlling users
router.get(
	"/users",
	authenticateSeller,
	sellerController.getAllUsers.bind(sellerController)
);
router.get(
	"/orders",
	authenticateSeller,
	sellerController.getAllOrders.bind(sellerController)
);

export default router;
