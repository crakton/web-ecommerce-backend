import { Request, Response } from "express";
import { PaystackService } from "../services/paystack.service";
import { v4 as uuidv4 } from "uuid";
import { Cart, Order, Product } from "../models";

export class PaymentController {
	private paystackService: PaystackService;

	constructor() {
		this.paystackService = new PaystackService();
	}

	/**
	 * Initiate a payment transaction
	 */
	public initiatePayment = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const startTime = Date.now();
			const { email, orderId, amount, callbackUrl } = req.body;

			// Validate required fields
			if (!email || !amount) {
				res.status(400).json({
					success: false,
					message: "Email and amount are required",
				});
				return;
			}

			// Find the order
			const order = await Order.findOne({ orderId });
			if (!order) {
				res.status(404).json({ success: false, message: "Order not found" });
				return;
			}

			// Generate a unique reference if not provided
			const reference = `PAY-${uuidv4()}`;

			// Log payment initiation
			console.info("[Payment] Initiating payment", {
				timestamp: new Date().toISOString(),
				email,
				amount,
				reference,
				orderId,
			});

			// Prepare metadata for tracking
			// const metadata = {
			// 	orderId,
			// 	custom_fields: [
			// 		{
			// 			display_name: "Cart ID",
			// 			variable_name: "cart_id",
			// 			value: orderId,
			// 		},
			// 	],
			// };

			// Initialize payment
			const paymentData = await this.paystackService.initiatePayment(
				email,
				amount,
				reference,
				null, // metadata,
				callbackUrl
			);

			// Update order with payment reference
			order.paymentReference = paymentData.data.reference;
			await order.save();

			// Log successful payment initiation
			console.info("[Payment] Payment initiated successfully", {
				timestamp: new Date().toISOString(),
				processingTime: Date.now() - startTime,
				reference,
				orderId,
			});

			res.status(200).json({
				success: true,
				message: "Payment initiated successfully",
				data: paymentData.data,
			});
		} catch (error) {
			// Log detailed error information
			console.error("[Payment] Payment initiation failed", {
				timestamp: new Date().toISOString(),
				error: {
					message: (error as Error).message,
					stack: (error as Error).stack,
					name: (error as Error).name,
				},
				requestData: req.body,
			});

			res.status(500).json({
				success: false,
				message: "Failed to initiate payment",
				error: (error as Error).message,
			});
		}
	};

	/**
	 * Verify a payment transaction
	 */
	public verifyPayment = async (req: Request, res: Response): Promise<void> => {
		try {
			const { reference } = req.params;

			if (!reference) {
				res.status(400).json({
					success: false,
					message: "Reference is required",
				});
				return;
			}

			// Log verification attempt
			console.info("[Payment] Verifying payment", {
				timestamp: new Date().toISOString(),
				reference,
			});

			const verificationData = await this.paystackService.verifyPayment(
				reference
			);

			// Find the order using the reference
			const order = await Order.findOne({ paymentReference: reference });
			if (!order) {
				res.status(404).json({ success: false, message: "Order not found" });
				return;
			}

			if (verificationData.data.status === "success") {
				// Payment successful, update order status
				order.status = "Processing";
				order.paymentStatus = "Paid";
				order.updatedAt = new Date();
				await order.save();

				// Update product inventory
				for (const item of order.products) {
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

				// Clear the cart
				const cart = await Cart.findOne({ userId: order.userId });
				if (cart) {
					cart.productsInCart = [];
					cart.total = 0;
					cart.updatedAt = new Date();
					await cart.save();
				}

				res.status(200).json({
					success: true,
					message: "Payment confirmed and order processed successfully",
					data: {
						orderId: order.orderId,
						status: order.status,
						paymentStatus: order.paymentStatus,
					},
				});
			} else {
				// Payment failed, update order status
				order.paymentStatus = "Failed";
				order.updatedAt = new Date();
				await order.save();

				res.status(200).json({
					success: false,
					message: "Payment verification failed",
					data: {
						orderId: order.orderId,
						status: order.status,
						paymentStatus: order.paymentStatus,
					},
				});
			}
		} catch (error) {
			// Log detailed error information
			console.error("[Payment] Payment verification error", {
				timestamp: new Date().toISOString(),
				error: {
					message: (error as Error).message,
					stack: (error as Error).stack,
					name: (error as Error).name,
				},
				reference: req.params.reference,
			});

			res.status(500).json({
				success: false,
				message: "Failed to verify payment",
				error: (error as Error).message,
			});
		}
	};

	/**
	 * Handle Paystack webhook
	 */
	public webhook = async (req: Request, res: Response): Promise<void> => {
		try {
			// Verify that the request is from Paystack
			const hash = req.headers["x-paystack-signature"];
			// Ideally, verify this signature with your secret key

			const event = req.body;

			// Handle different event types
			switch (event.event) {
				case "charge.success":
					// Handle successful charge
					console.info("[Payment] Webhook: Charge successful", {
						reference: event.data.reference,
						amount: event.data.amount / 100,
						email: event.data.customer.email,
					});

					// Update order status here
					// Example: await orderService.updateOrderStatus(event.data.metadata.cartId, "paid");
					break;

				case "transfer.success":
					// Handle successful transfer
					console.info("[Payment] Webhook: Transfer successful", {
						reference: event.data.reference,
					});
					break;

				default:
					console.info(
						`[Payment] Webhook: Unhandled event type: ${event.event}`
					);
			}

			// Acknowledge receipt of webhook
			res.status(200).send("Webhook received");
		} catch (error) {
			console.error("[Payment] Webhook processing error", {
				error: (error as Error).message,
			});

			// Still return 200 to acknowledge receipt of webhook
			res.status(200).send("Webhook received");
		}
	};

	/**
	 * Get list of banks (helpful for bank transfers)
	 */
	public getBanks = async (req: Request, res: Response): Promise<void> => {
		try {
			const banks = await this.paystackService.listBanks();

			res.status(200).json({
				success: true,
				message: "Banks fetched successfully",
				data: banks.data,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to fetch banks",
				error: (error as Error).message,
			});
		}
	};
}
