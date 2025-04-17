import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authenticateSeller } from "../middlewares/authenticate-seller.middleware";

const router = Router();
const reviewController = new ReviewController();

router.post("/new", reviewController.createReview.bind(reviewController));
router.get(
	"/product/:productId",
	reviewController.getProductReviews.bind(reviewController)
);
router.get(
	"/",
	authenticateSeller,
	reviewController.getAllReviews.bind(reviewController)
);
router.get("/user/:userId", reviewController.getUserReviews);
router.put("/:reviewId", authenticateSeller, reviewController.updateReview);
router.delete("/:reviewId", authenticateSeller, reviewController.deleteReview);

export default router;
