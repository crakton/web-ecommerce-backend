import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const orderController = new OrderController();

router.post("/new", orderController.createOrder.bind(orderController));
router.get("/:orderId", orderController.getOrder.bind(orderController));
router.get(
	"/users/:userId/orders",
	orderController.getUserOrders.bind(orderController)
);
router.put(
	"/:orderId/status",
	orderController.updateOrderStatus.bind(orderController)
);

export default router;
