import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Seller } from "../models";
import { ELoginStatus } from "../enums";

interface DecodedToken {
	sellerId: string;
	iat: number;
	exp: number;
}

export const authenticateSeller = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		// Get token from Authorization header
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res.status(401).json({
				success: false,
				message: "Authentication required. No token provided.",
			});
			return;
		}

		const token = authHeader.split(" ")[1];

		// Verify token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "your-secret-key" // Make sure this matches your token generation secret
		) as DecodedToken;

		console.log("Decoded token:", decoded); // Debug: See what's in the token

		// Find seller by sellerId (which is what we stored in the token)
		const seller = await Seller.findOne({ sellerId: decoded.sellerId });

		if (!seller) {
			console.log("Seller not found with ID:", decoded.sellerId);
			res.status(404).json({
				success: false,
				message: "Seller not found",
			});
			return;
		}

		// Check if logged in (using the enum from your system)
		if (seller.loggedIn !== ELoginStatus.LOGGED_IN) {
			res.status(401).json({
				success: false,
				message: "Session expired. Please login again.",
			});
			return;
		}

		// Attach seller info to request
		(req as any).seller = {
			id: seller._id,
			email: seller.email,
			role: seller.role || "seller",
		};

		next();
	} catch (error) {
		console.error("Authentication error:", error);
		res.status(401).json({
			success: false,
			message: "Invalid token or expired session",
			error:
				process.env.NODE_ENV === "development"
					? (error as Error).message
					: undefined,
		});
		return;
	}
};
