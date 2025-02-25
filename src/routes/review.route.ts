import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";

const router = Router();
const reviewController = new ReviewController();

router.post("/new", reviewController.createReview);
router.get("/product/:productId", reviewController.getProductReviews);
router.get("/user/:userId", reviewController.getUserReviews);
router.put("/:reviewId", reviewController.updateReview);
router.delete("/:reviewId", reviewController.deleteReview);

export default router;
