import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.put("/update/:userId", authController.updateUser.bind(authController));
router.put(
	"/change-password/:userId",
	authController.changePassword.bind(authController)
);
router.get(
	"/profile/:userId",
	authController.getUserProfile.bind(authController)
);
router.put(
	"/update-status/:userId",
	authController.updateAccountStatus.bind(authController)
);

export default router;
