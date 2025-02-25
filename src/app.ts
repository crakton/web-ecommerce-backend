import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./config/db";
import ShiprocketService from "./services/shiprocket.service";
import authRoutes from "./routes/auth.route";
import cartRoutes from "./routes/cart.route";
import complaintRoutes from "./routes/complaint.route";
import couponRoutes from "./routes/coupon.route";
import imageRoutes from "./routes/image.route";
import orderRoutes from "./routes/order.route";
import productRoutes from "./routes/product.route";
import reviewRoutes from "./routes/review.route";
import sellerRoutes from "./routes/seller.route";

config();

const app = express();

// Middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

// Middleware
app.use(express.json());
app.use(
	cors({
		origin: [
			"https://www.merabestie.com",
			"http://localhost:3000",
			"*.merabestie.com",
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"X-Api-Key",
			"X-Api-HMAC-SHA256",
		],
	})
);

// Routes
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/complaints", complaintRoutes);
app.use("/coupons", couponRoutes);
app.use("/images", imageRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);
app.use("/sellers", sellerRoutes);

interface ShiprocketOrderRequest {
	cart_data: {
		items: Array<{
			variant_id: string;
			quantity: number;
		}>;
	};
	redirect_url: string;
	timestamp: string;
	metadata?: {
		cartId: string;
		totalAmount: number;
		itemCount: number;
	};
}
// Shiprocket integration
app.post(
	"/shiprocket/order",
	async (req: Request, res: Response): Promise<void> => {
		const startTime = Date.now();

		try {
			const orderData: ShiprocketOrderRequest = req.body;

			// Log order initiation
			console.info("[Shiprocket] Processing order request", {
				timestamp: new Date().toISOString(),
				cartId: orderData.metadata?.cartId,
				itemCount: orderData.metadata?.itemCount,
				totalAmount: orderData.metadata?.totalAmount,
			});

			// Validate request data
			if (
				!orderData.cart_data ||
				!orderData.cart_data.items ||
				orderData.cart_data.items.length === 0
			) {
				console.error("[Shiprocket] Invalid order data", {
					timestamp: new Date().toISOString(),
					data: orderData,
				});
				res.status(400).json({
					success: false,
					message: "Invalid order data",
				});
				return;
			}

			// Log items being processed
			console.info("[Shiprocket] Processing items", {
				items: orderData.cart_data.items.map((item) => ({
					variant_id: item.variant_id,
					quantity: item.quantity,
				})),
			});

			// Create order
			const token = await ShiprocketService.createOrder(orderData.cart_data);

			// Log successful order creation
			console.info("[Shiprocket] Order processed successfully", {
				timestamp: new Date().toISOString(),
				processingTime: Date.now() - startTime,
				cartId: orderData.metadata?.cartId,
				hasToken: !!token,
			});

			res.status(200).json({
				success: true,
				token,
				message: "Order processed successfully",
			});
		} catch (error) {
			// Log detailed error information
			console.error("[Shiprocket] Order processing failed", {
				timestamp: new Date().toISOString(),
				error: {
					message: (error as Error).message,
					stack: (error as Error).stack,
					name: (error as Error).name,
				},
				processingTime: Date.now() - startTime,
				requestData: req.body,
			});

			res.status(500).json({
				success: false,
				message: "Failed to process order",
				error: (error as Error).message,
			});
		}
	}
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		message: "Internal server error",
		error: process.env.NODE_ENV === "development" ? err.message : undefined,
	});
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();

export default app;
