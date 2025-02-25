import mongoose, { Document, Schema } from "mongoose";
import { ICoupon } from "../types/interfaces";

const couponSchema = new Schema<ICoupon>({
	code: {
		type: String,
		required: true,
		unique: true,
	},
	discountPercentage: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["active", "expired", "disabled"],
		default: "active",
	},
});

export const CouponModel = mongoose.model<ICoupon>("Coupon", couponSchema);
