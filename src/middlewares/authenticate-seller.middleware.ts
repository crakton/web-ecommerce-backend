import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Seller } from "../models";
interface DecodedToken {
	id: string;
	email: string;
	role: string;
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
			process.env.JWT_SECRET || "your_jwt_secret"
		) as DecodedToken;

		// Check if seller exists
		const seller = await Seller.findById(decoded.id);
		if (!seller) {
			res.status(404).json({
				success: false,
				message: "Seller not found",
			});
			return;
		}

		// Check if logged in
		if (seller.loggedIn !== "loggedin") {
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
			role: "seller",
		};

		next();
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Invalid token or expired session",
		});
		return;
	}
};
