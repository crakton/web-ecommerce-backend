import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();
const paymentController = new PaymentController();

// Payment routes
router.post("/process-payment", paymentController.initiatePayment);
router.get("/verify-payment/:reference", paymentController.verifyPayment);
router.post("/webhook", paymentController.webhook);
router.get("/banks", paymentController.getBanks);

export default router;
