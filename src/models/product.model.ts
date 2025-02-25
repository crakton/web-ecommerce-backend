import { model, Schema } from "mongoose";
import { IProduct } from "../types/interfaces";

const ProductSchema = new Schema<IProduct>({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	img: [{ type: String }],
	category: { type: String, required: true },
	description: { type: String, required: true },
	rating: { type: Number, default: 0 },
	productId: { type: String, required: true, unique: true },
	inStockValue: { type: Number, required: true, default: 0 },
	soldStockValue: { type: Number, default: 0 },
	visibility: { type: String, default: "on" },
});

const ProductModel = model<IProduct>("Product", ProductSchema);
export default ProductModel;
