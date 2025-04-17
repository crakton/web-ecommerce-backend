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
import uploadRoutes from "./routes/image.route";
import paymentRoutes from "./routes/payment.route";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
config();

const app = express();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
	console.log(`Created uploads directory at ${uploadsDir}`);
}

// Configure express-fileupload middleware
app.use(
	fileUpload({
		createParentPath: true,
		limits: {
			fileSize: 10 * 1024 * 1024, // 10MB limit
		},
		abortOnLimit: true,
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`${req.method} ${req.url}`);
	next();
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error("Request body:", req.body);
	console.error("Error:", err);
	res.status(500).json({
		success: false,
		message: err.message || "Internal server error",
		stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/carts", cartRoutes);
app.use("/complaints", complaintRoutes);
app.use("/coupons", couponRoutes);
app.use("/platforms", imageRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin", sellerRoutes);
app.use("/upload", uploadRoutes);
app.use("/payments", paymentRoutes);

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
