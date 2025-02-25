import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();
const productController = new ProductController();

router.post("/new", productController.createProduct);
router.get("", productController.getProducts);
router.get("/:productId", productController.getProduct);
router.put("/:productId", productController.updateProduct);
router.delete("/:productId", productController.deleteProduct);
router.patch("/:productId/stock", productController.updateStock);
router.patch("/:productId/visibility", productController.updateVisibility);
router.get("/search", productController.searchProducts);

export default router;
