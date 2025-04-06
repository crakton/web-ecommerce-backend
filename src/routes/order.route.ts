import express, { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const orderController = new OrderController();

// Checkout and payment routes
router.post("/checkout", orderController.initiateCheckout);
// router.post("/process-payment", orderController.processPayment);
// router.get("/confirm-payment/:reference", orderController.confirmPayment);

// Order management routes
router.get("/:orderId", orderController.getOrder);
router.get("/user/:userId", orderController.getUserOrders);
router.patch("/:orderId/status", orderController.updateOrderStatus);

export default router;
