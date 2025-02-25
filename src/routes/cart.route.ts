import { Router } from "express";
import { CartController } from "../controllers/cart.controller";

const router = Router();
const cartController = new CartController();

router.post("/add", cartController.addToCart);
router.get("/items", cartController.getAllCartItems);
router.put("/update-qty", cartController.updateCartItemQuantity);
router.delete("/remove/:userId/:productId", cartController.removeFromCart);
router.get("/:userId", cartController.getCart);
router.delete("/clear/:userId", cartController.clearCart);

export default router;
