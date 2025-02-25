import { model, Schema } from "mongoose";
import { IReview } from "../types/interfaces";

const ReviewSchema = new Schema<IReview>({
	productId: { type: String, required: true },
	userId: { type: String, required: true },
	review: { type: String, required: true },
	rating: { type: Number, required: true, min: 1, max: 5 },
	verified: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

const ReviewModel = model<IReview>("Review", ReviewSchema);

export default ReviewModel;
