import { Request, Response } from "express";
import { Cart, Product } from "../models";
import { v4 as uuidv4 } from "uuid";

export class CartController {
	public async addToCart(req: Request, res: Response): Promise<void> {
		try {
			const { userId, productId, productQty } = req.body;
			const quantity = Number(productQty); // cast into number

			const product = await Product.findOne({ productId });
			if (!product) {
				res.status(404).json({ status: false, message: "Product not found" });
				return;
			}
			if (isNaN(quantity) || quantity <= 0) {
				res.status(400).json({ status: false, message: "Invalid quantity" });
				return;
			}

			if (product.inStockValue < quantity) {
				res.status(400).json({ status: false, message: "Insufficient stock" });
				return;
			}

			let cart = await Cart.findOne({ userId });
			if (!cart) {
				cart = new Cart({
					cartId: uuidv4(),
					userId,
					productsInCart: [],
					total: 0,
				});
			}

			const existingProductIndex = cart.productsInCart.findIndex(
				(item) => item.productId.toString() === productId.toString()
			);

			if (existingProductIndex > -1) {
				cart.productsInCart[existingProductIndex].quantity += quantity;
			} else {
				cart.productsInCart.push({
					productId,
					quantity,
					price: product.price,
					name: product.name,
					img: product.img,
					category: product.category,
				});
			}

			cart.total = cart.productsInCart.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);
			cart.updatedAt = new Date();

			await cart.save();
			res.status(200).json({
				success: true,
				data: cart,
				message: "Successfully added new item",
			});
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error adding item to cart", error });
		}
	}
	public async getAllCartItems(req: Request, res: Response): Promise<void> {
		try {
			let cart = await Cart.find();

			res.status(200).json({
				success: true,
				data: cart,
				message: "All cart items",
			});
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error adding item to cart", error });
		}
	}

	public async updateCartItemQuantity(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { userId, productId, productQty } = req.body;
			const quantity = Number(productQty); // cast into number

			const product = await Product.findOne({ productId });
			if (!product) {
				res.status(404).json({ status: false, message: "Product not found" });
				return;
			}

			if (product.inStockValue < quantity) {
				res.status(400).json({ success: false, message: "Insufficient stock" });
				return;
			}

			const cart = await Cart.findOne({ userId });
			if (!cart) {
				res.status(404).json({ status: false, message: "Cart not found" });
				return;
			}

			const productIndex = cart.productsInCart.findIndex(
				(item) => item.productId === productId
			);

			if (productIndex === -1) {
				res
					.status(404)
					.json({ success: false, message: "Product not found in cart" });
				return;
			}

			if (quantity <= 0) {
				cart.productsInCart.splice(productIndex, 1);
			} else {
				cart.productsInCart[productIndex].quantity = quantity;
			}

			cart.total = cart.productsInCart.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);
			cart.updatedAt = new Date();

			await cart.save();
			res.status(200).json({
				status: true,
				cart,
				message: "Cart item quantity updated successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error updating cart item quantity",
				error,
			});
		}
	}

	public async removeFromCart(req: Request, res: Response): Promise<void> {
		try {
			const { userId, productId } = req.params;

			const cart = await Cart.findOne({ userId });
			if (!cart) {
				res.status(404).json({ success: false, message: "Cart not found" });
				return;
			}

			const productIndex = cart.productsInCart.findIndex(
				(item) => item.productId === productId
			);

			if (productIndex === -1) {
				res
					.status(404)
					.json({ success: false, message: "Product not found in cart" });
				return;
			}

			cart.productsInCart.splice(productIndex, 1);
			cart.total = cart.productsInCart.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);
			cart.updatedAt = new Date();

			await cart.save();
			res
				.status(200)
				.json({
					status: true,
					cart,
					message: "Item removed from cart successfully",
				});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error removing item from cart",
				error,
			});
		}
	}

	public async getCart(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const cart = await Cart.findOne({ userId });

			if (!cart) {
				res.status(404).json({ success: false, message: "Cart not found" });
				return;
			}

			res.status(200).json({
				status: true,
				cart,
				message: "User cart items fetched successfully",
			});
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: "Error fetching cart", error });
		}
	}

	public async clearCart(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const cart = await Cart.findOne({ userId });

			if (!cart) {
				res.status(404).json({ success: false, message: "Cart not found" });
				return;
			}

			cart.productsInCart = [];
			cart.total = 0;
			cart.updatedAt = new Date();

			await cart.save();
			res
				.status(200)
				.json({ success: false, message: "Cart cleared successfully" });
		} catch (error) {
			res
				.status(500)
				.json({ success: false, message: "Error clearing cart", error });
		}
	}
}
