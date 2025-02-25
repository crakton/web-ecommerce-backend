import { model, Schema } from "mongoose";
import { ICart } from "../types/interfaces";

const CartSchema = new Schema<ICart>({
	cartId: { type: String, required: true, unique: true },
	userId: { type: String, required: true },
	productsInCart: [
		{
			productId: { type: String, required: true },
			quantity: { type: Number, required: true, min: 1 },
			price: { type: Number, required: true },
			name: { type: String, required: true },
			category: { type: String, required: true },
			img: [{ type: String, required: true }],
		},
	],
	total: { type: Number, required: true, default: 0 },
	updatedAt: { type: Date, default: Date.now },
});

const CartModel = model<ICart>("Cart", CartSchema);
export default CartModel;
