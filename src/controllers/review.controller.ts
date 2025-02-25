import { Request, Response } from "express";
import { Order, Product, Review } from "../models";

export class ReviewController {
	public async createReview(req: Request, res: Response): Promise<void> {
		try {
			const { userId, productId, review, rating } = req.body;

			const userOrders = await Order.find({
				userId,
				productIds: productId,
				status: "Delivered",
			});

			const verified = userOrders.length > 0;

			const newReview = new Review({
				userId,
				productId,
				review,
				rating,
				verified,
			});

			await newReview.save();

			const allProductReviews = await Review.find({ productId });
			const averageRating =
				allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) /
				allProductReviews.length;

			await Product.findOneAndUpdate(
				{ productId },
				{ rating: Math.round(averageRating * 10) / 10 }
			);

			res.status(201).json(newReview);
		} catch (error) {
			res.status(500).json({ message: "Error creating review", error });
		}
	}

	public async getProductReviews(req: Request, res: Response): Promise<void> {
		try {
			const { productId } = req.params;
			const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

			res.status(200).json(reviews);
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error fetching product reviews", error });
		}
	}

	public async getUserReviews(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const reviews = await Review.find({ userId }).sort({ createdAt: -1 });

			res.status(200).json(reviews);
		} catch (error) {
			res.status(500).json({ message: "Error fetching user reviews", error });
		}
	}

	public async updateReview(req: Request, res: Response): Promise<void> {
		try {
			const { reviewId } = req.params;
			const { review, rating } = req.body;

			const updatedReview = await Review.findByIdAndUpdate(
				reviewId,
				{ review, rating },
				{ new: true }
			);

			if (!updatedReview) {
				res.status(404).json({ message: "Review not found" });
				return;
			}

			const productId = updatedReview.productId;
			const allProductReviews = await Review.find({ productId });
			const averageRating =
				allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) /
				allProductReviews.length;

			await Product.findOneAndUpdate(
				{ productId },
				{ rating: Math.round(averageRating * 10) / 10 }
			);

			res.status(200).json(updatedReview);
		} catch (error) {
			res.status(500).json({ message: "Error updating review", error });
		}
	}

	public async deleteReview(req: Request, res: Response): Promise<void> {
		try {
			const { reviewId } = req.params;
			const review = await Review.findByIdAndDelete(reviewId);

			if (!review) {
				res.status(404).json({ message: "Review not found" });
				return;
			}

			const productId = review.productId;
			const allProductReviews = await Review.find({ productId });
			const averageRating =
				allProductReviews.length > 0
					? allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) /
					  allProductReviews.length
					: 0;

			await Product.findOneAndUpdate(
				{ productId },
				{ rating: Math.round(averageRating * 10) / 10 }
			);

			res.status(200).json({ message: "Review deleted successfully" });
		} catch (error) {
			res.status(500).json({ message: "Error deleting review", error });
		}
	}
}
