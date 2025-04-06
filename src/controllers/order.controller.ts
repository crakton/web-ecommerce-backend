import { Request, Response } from "express";
import { Order, Cart, Product } from "../models";
import { v4 as uuidv4 } from "uuid";
import { PaystackService } from "../services/paystack.service";

export class OrderController {
	private paystackService: PaystackService;

	constructor() {
		this.paystackService = new PaystackService();
	}

	// Step 1: Initiate checkout process (create pending order)
	public async initiateCheckout(req: Request, res: Response): Promise<void> {
		try {
			const { userId, cartId, address, email, name, paymentMethod } = req.body;

			// Add this before creating a new order
			const existingPendingOrder = await Order.findOne({
				userId,
				cartId,
				status: "Pending",
				paymentStatus: "Pending",
			});

			if (existingPendingOrder) {
				// Return the existing pending order instead of creating a new one
				res.status(200).json({
					success: true,
					message: "Using existing pending order",
					data: {
						orderId: existingPendingOrder.orderId,
						amount: existingPendingOrder.price,
						email: existingPendingOrder.email,
					},
				});
				return;
			}

			// Validate cart and stock
			const cart = await Cart.findOne({ userId });
			if (!cart || cart.productsInCart.length === 0) {
				res.status(400).json({ success: false, message: "Cart is empty" });
				return;
			}

			// Check product stock
			for (const item of cart.productsInCart) {
				const product = await Product.findOne({ productId: item.productId });
				if (!product || product.inStockValue < item.quantity) {
					res.status(400).json({
						success: false,
						message: `Insufficient stock for product: ${item.name}`,
					});
					return;
				}
			}

			// Create a new order with "Pending" status
			const orderId = uuidv4();
			const order = new Order({
				orderId,
				userId,
				date: new Date().toLocaleDateString(),
				time: new Date().toLocaleTimeString(),
				address,
				email,
				name,
				productIds: cart.productsInCart.map((item) => item.productId),
				products: cart.productsInCart, // Store full product details
				price: cart.total,
				paymentMethod,
				status: "Pending",
				paymentStatus: "Pending",
				updatedAt: new Date(),
			});

			await order.save();

			// Return order details and cart info for payment processing
			res.status(201).json({
				success: true,
				message: "Checkout initiated successfully",
				data: {
					orderId: order.orderId,
					amount: order.price,
					email: order.email,
				},
			});
		} catch (error) {
			console.error("[Order] Checkout initiation failed:", error);
			res.status(500).json({
				success: false,
				message: "Error initiating checkout",
				error: (error as Error).message,
			});
		}
	}

	// Step 2: Process payment (this will be called by the frontend after checkout)
	// public async processPayment(req: Request, res: Response): Promise<void> {
	// 	try {
	// 		const { orderId, email, callbackUrl } = req.body;

	// 		// Find the order
	// 		const order = await Order.findOne({ orderId });
	// 		if (!order) {
	// 			res.status(404).json({ success: false, message: "Order not found" });
	// 			return;
	// 		}

	// 		// Initiate payment with Paystack
	// 		const paymentResponse = await this.paystackService.initiatePayment(
	// 			email,
	// 			order.price,
	// 			orderId, // Use orderId as reference
	// 			{ orderId: order.orderId, userId: order.userId },
	// 			callbackUrl
	// 		);

	// 		res.status(200).json({
	// 			success: true,
	// 			message: "Payment initiated successfully",
	// 			data: {
	// 				authorizationUrl: paymentResponse.data.authorization_url,
	// 				reference: paymentResponse.data.reference,
	// 				accessCode: paymentResponse.data.access_code,
	// 			},
	// 		});
	// 	} catch (error) {
	// 		console.error("[Order] Payment processing failed:", error);
	// 		res.status(500).json({
	// 			success: false,
	// 			message: "Error processing payment",
	// 			error: (error as Error).message,
	// 		});
	// 	}
	// }

	// Step 3: Confirm payment and complete order
	// public async confirmPayment(req: Request, res: Response): Promise<void> {
	// 	try {
	// 		const { reference } = req.params;

	// 		// Verify payment with Paystack
	// 		const verificationData = await this.paystackService.verifyPayment(
	// 			reference
	// 		);

	// 		// Find the order using the reference
	// 		const order = await Order.findOne({ paymentReference: reference });
	// 		if (!order) {
	// 			res.status(404).json({ success: false, message: "Order not found" });
	// 			return;
	// 		}

	// 		if (verificationData.data.status === "success") {
	// 			// Payment successful, update order status
	// 			order.status = "Processing";
	// 			order.paymentStatus = "Paid";
	// 			order.updatedAt = new Date();
	// 			await order.save();

	// 			// Update product inventory
	// 			for (const item of order.products) {
	// 				await Product.findOneAndUpdate(
	// 					{ productId: item.productId },
	// 					{
	// 						$inc: {
	// 							inStockValue: -item.quantity,
	// 							soldStockValue: item.quantity,
	// 						},
	// 					}
	// 				);
	// 			}

	// 			// Clear the cart
	// 			const cart = await Cart.findOne({ userId: order.userId });
	// 			if (cart) {
	// 				cart.productsInCart = [];
	// 				cart.total = 0;
	// 				cart.updatedAt = new Date();
	// 				await cart.save();
	// 			}

	// 			res.status(200).json({
	// 				success: true,
	// 				message: "Payment confirmed and order processed successfully",
	// 				data: {
	// 					orderId: order.orderId,
	// 					status: order.status,
	// 					paymentStatus: order.paymentStatus,
	// 				},
	// 			});
	// 		} else {
	// 			// Payment failed, update order status
	// 			order.paymentStatus = "Failed";
	// 			order.updatedAt = new Date();
	// 			await order.save();

	// 			res.status(200).json({
	// 				success: false,
	// 				message: "Payment verification failed",
	// 				data: {
	// 					orderId: order.orderId,
	// 					status: order.status,
	// 					paymentStatus: order.paymentStatus,
	// 				},
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error("[Order] Payment confirmation failed:", error);
	// 		res.status(500).json({
	// 			success: false,
	// 			message: "Error confirming payment",
	// 			error: (error as Error).message,
	// 		});
	// 	}
	// }

	// Get a specific order
	public async getOrder(req: Request, res: Response): Promise<void> {
		try {
			const { orderId } = req.params;
			const order = await Order.findOne({ orderId });

			if (!order) {
				res.status(404).json({ success: false, message: "Order not found" });
				return;
			}

			res.status(200).json({ success: true, data: order });
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error fetching order",
				error: (error as Error).message,
			});
		}
	}

	// Get all orders for a user
	public async getUserOrders(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const orders = await Order.find({ userId }).sort({ createdAt: -1 });

			res.status(200).json({ success: true, data: orders });
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error fetching user orders",
				error: (error as Error).message,
			});
		}
	}

	// Update order status (for admin purposes)
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
				res.status(404).json({ success: false, message: "Order not found" });
				return;
			}

			res.status(200).json({ success: true, data: order });
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error updating order status",
				error: (error as Error).message,
			});
		}
	}
}
