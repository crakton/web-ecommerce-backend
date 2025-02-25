import { Request, Response } from "express";
import { Order, Cart, Product } from "../models";
import { v4 as uuidv4 } from "uuid";

export class OrderController {
	public async createOrder(req: Request, res: Response): Promise<void> {
		try {
			const { userId, address, email, name, paymentMethod } = req.body;

			const cart = await Cart.findOne({ userId });
			if (!cart || cart.productsInCart.length === 0) {
				res.status(400).json({ message: "Cart is empty" });
				return;
			}

			for (const item of cart.productsInCart) {
				const product = await Product.findOne({ productId: item.productId });
				if (!product || product.inStockValue < item.quantity) {
					res.status(400).json({
						message: `Insufficient stock for product: ${item.name}`,
					});
					return;
				}
			}

			const order = new Order({
				orderId: uuidv4(),
				userId,
				date: new Date().toLocaleDateString(),
				time: new Date().toLocaleTimeString(),
				address,
				email,
				name,
				productIds: cart.productsInCart.map((item) => item.productId),
				price: cart.total,
				paymentMethod,
				updatedAt: new Date(),
			});

			for (const item of cart.productsInCart) {
				await Product.findOneAndUpdate(
					{ productId: item.productId },
					{
						$inc: {
							inStockValue: -item.quantity,
							soldStockValue: item.quantity,
						},
					}
				);
			}

			await order.save();

			cart.productsInCart = [];
			cart.total = 0;
			cart.updatedAt = new Date();
			await cart.save();

			res.status(201).json(order);
		} catch (error) {
			res.status(500).json({ message: "Error creating order", error });
		}
	}

	public async getOrder(req: Request, res: Response): Promise<void> {
		try {
			const { orderId } = req.params;
			const order = await Order.findOne({ orderId });

			if (!order) {
				res.status(404).json({ message: "Order not found" });
				return;
			}

			res.status(200).json(order);
		} catch (error) {
			res.status(500).json({ message: "Error fetching order", error });
		}
	}

	public async getUserOrders(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const orders = await Order.find({ userId }).sort({ createdAt: -1 });

			res.status(200).json(orders);
		} catch (error) {
			res.status(500).json({ message: "Error fetching user orders", error });
		}
	}

	public async updateOrderStatus(req: Request, res: Response): Promise<void> {
		try {
			const { orderId } = req.params;
			const { status } = req.body;

			const order = await Order.findOneAndUpdate(
				{ orderId },
				{
					status,
					updatedAt: new Date(),
				},
				{ new: true }
			);

			if (!order) {
				res.status(404).json({ message: "Order not found" });
				return;
			}

			res.status(200).json(order);
		} catch (error) {
			res.status(500).json({ message: "Error updating order status", error });
		}
	}
}
