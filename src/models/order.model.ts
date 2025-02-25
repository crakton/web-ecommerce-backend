import { model, Schema } from "mongoose";
import { IOrder } from "../types/interfaces";

const OrderSchema = new Schema<IOrder>({
	orderId: { type: String, required: true, unique: true },
	userId: { type: String, required: true },
	date: String,
	time: String,
	address: { type: String, required: true },
	email: { type: String, required: true },
	name: { type: String, required: true },
	productIds: [{ type: String }],
	trackingId: String,
	price: { type: Number, required: true },
	status: {
		type: String,
		enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
		default: "Pending",
	},
	paymentMethod: {
		type: String,
		enum: ["Credit Card", "Debit Card", "Net Banking", "UPI", "COD"],
	},
	paymentStatus: {
		type: String,
		enum: ["Paid", "Unpaid", "Refunded", "Pending"],
		default: "Pending",
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: Date,
});

const OrderModel = model<IOrder>("Order", OrderSchema);
export default OrderModel;
