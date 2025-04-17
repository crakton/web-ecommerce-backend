import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
	IChangePasswordDTO,
	ISeller,
	ISellerLoginDTO,
	ISellerRegistrationDTO,
	ISellerResponseDTO,
	IUpdateSellerDTO,
	IVerifyOtpDTO,
} from "../types/interfaces";
import { Order, Seller, User } from "../models";
import { ELoginStatus } from "../enums";
import { v4 as uuidv4 } from "uuid";

class SellerController {
	private generateToken(sellerId: string): string {
		return jwt.sign({ sellerId }, process.env.JWT_SECRET || "your-secret-key", {
			expiresIn: "24h",
		});
	}

	private generateOTP(): string {
		return Math.floor(100000 + Math.random() * 900000).toString();
	}

	private mapSellerToResponseDTO(seller: ISeller): ISellerResponseDTO {
		return {
			id: seller._id as string,
			name: seller.name,
			email: seller.email,
			sellerId: seller.sellerId,
			emailVerified: seller.emailVerified,
			phoneVerified: seller.phoneVerified,
			phoneNumber: seller.phoneNumber,
			businessName: seller.businessName,
			businessAddress: seller.businessAddress,
			businessType: seller.businessType!,
		};
	}

	/**
	 * Register a new seller
	 */
	public async register(req: Request, res: Response): Promise<void> {
		try {
			const sellerData: ISellerRegistrationDTO = req.body;

			// Check if email already exists
			const existingSeller = await Seller.findOne({ email: sellerData.email });
			if (existingSeller) {
				res.status(400).json({
					success: false,
					message: "Email already registered",
				});
				return;
			}

			// Hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(sellerData.password, salt);

			// Create seller
			const seller = new Seller({
				...sellerData,
				password: hashedPassword,
				sellerId: uuidv4(),
			});

			await seller.save();

			const token = this.generateToken(seller.sellerId);

			res.status(201).json({
				success: true,
				message: "Seller registered successfully",
				data: {
					token,
					seller,
				},
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Failed to register seller",
				error: error.message,
			});
			return;
		}
	}

	/**
	 * Login seller
	 */

	public async login(req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;

			// Find user
			const seller = await Seller.findOne({ email });
			if (!seller) {
				res.status(401).json({ status: false, message: "Invalid credentials" });
				return;
			}

			// Verify password
			const isPasswordValid = await seller.comparePassword(password);
			if (!isPasswordValid) {
				res.status(401).json({ status: false, message: "Invalid credentials" });
				return;
			}
			// Set loggedin state
			seller.loggedIn = ELoginStatus.LOGGED_IN;
			await seller.save();

			// Generate token
			const token = this.generateToken(seller.sellerId);

			res.status(200).json({
				status: true,
				token,
				seller,
				message: "Login successfully",
			});
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).json({
				success: false,
				message: "Login failed",
				error: error || "Unknown error occurred",
			});
			return;
		}
	}

	/**
	 * Verify OTP (email or phone)
	 */
	public async verifyOtp(req: Request, res: Response): Promise<void> {
		try {
			const { email, otp, type }: IVerifyOtpDTO = req.body;

			// Find seller by email
			const seller = await Seller.findOne({ email });
			if (!seller) {
				res.status(404).json({
					success: false,
					message: "Seller not found",
				});
				return;
			}

			// Verify OTP
			if (seller.otp !== otp) {
				res.status(400).json({
					success: false,
					message: "Invalid OTP",
				});
				return;
			}

			// Update verification status based on type
			if (type === "email") {
				seller.emailVerified = true;
			} else if (type === "phone") {
				seller.phoneVerified = true;
			}

			// Clear OTP after verification
			seller.otp = undefined;
			await seller.save();

			res.status(200).json({
				success: true,
				message: `${type} verified successfully`,
				data: {
					seller: this.mapSellerToResponseDTO(seller),
				},
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Verification failed",
				error: error.message,
			});
			return;
		}
	}

	/**
	 * Logout seller
	 */
	public async logout(req: Request, res: Response): Promise<void> {
		try {
			const sellerId = (req as any).seller.id;

			// Find seller by ID
			const seller = await Seller.findById(sellerId);
			if (!seller) {
				res.status(404).json({
					success: false,
					message: "Seller not found",
				});
				return;
			}

			// Update login status
			seller.loggedIn = ELoginStatus.LOGGED_OUT;
			await seller.save();

			res.status(200).json({
				success: true,
				message: "Logout successful",
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Logout failed",
				error: error.message,
			});
			return;
		}
	}

	/**
	 * Get seller profile
	 */
	public async getProfile(req: Request, res: Response): Promise<void> {
		try {
			const sellerId = (req as any).seller.id;

			// Find seller by ID
			const seller = await Seller.findById(sellerId);
			if (!seller) {
				res.status(404).json({
					success: false,
					message: "Seller not found",
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "Seller profile retrieved successfully",
				data: {
					seller: this.mapSellerToResponseDTO(seller),
				},
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Failed to retrieve profile",
				error: error.message,
			});
			return;
		}
	}

	/**
	 * Update seller profile
	 */
	public async updateProfile(req: Request, res: Response): Promise<void> {
		try {
			const sellerId = (req as any).seller.id;
			const updateData: IUpdateSellerDTO = req.body;

			// Find and update seller
			const seller = await Seller.findByIdAndUpdate(sellerId, updateData, {
				new: true,
				runValidators: true,
			});

			if (!seller) {
				res.status(404).json({
					success: false,
					message: "Seller not found",
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "Profile updated successfully",
				data: {
					seller: this.mapSellerToResponseDTO(seller),
				},
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Failed to update profile",
				error: error.message,
			});
		}
	}

	/**
	 * Change password
	 */
	public async changePassword(req: Request, res: Response): Promise<void> {
		try {
			const sellerId = (req as any).seller.id;
			const { currentPassword, newPassword }: IChangePasswordDTO = req.body;

			// Find seller by ID
			const seller = await Seller.findById(sellerId);
			if (!seller) {
				res.status(404).json({
					success: false,
					message: "Seller not found",
				});
				return;
			}

			// Verify current password
			const isPasswordValid = await seller.comparePassword(currentPassword);
			if (!isPasswordValid) {
				res.status(401).json({
					success: false,
					message: "Current password is incorrect",
				});
				return;
			}

			// Update password
			seller.password = newPassword;
			await seller.save();

			res.status(200).json({
				success: true,
				message: "Password changed successfully",
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Failed to change password",
				error: error.message,
			});
			return;
		}
	}

	/**
	 * Resend OTP
	 */
	public async resendOtp(req: Request, res: Response): Promise<void> {
		try {
			const { email, type } = req.body;

			// Find seller by email
			const seller = await Seller.findOne({ email });
			if (!seller) {
				res.status(404).json({
					success: false,
					message: "Seller not found",
				});
				return;
			}

			// Generate new OTP
			seller.otp = this.generateOTP();
			await seller.save();

			// TODO: Send OTP via email or SMS based on type

			res.status(200).json({
				success: true,
				message: `OTP sent to your ${type}`,
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Failed to send OTP",
				error: error.message,
			});
			return;
		}
	}

	/**
	 * Delete seller account
	 */
	public async deleteAccount(req: Request, res: Response): Promise<void> {
		try {
			const sellerId = (req as any).seller.id;

			// Find and delete seller
			const seller = await Seller.findByIdAndDelete(sellerId);
			if (!seller) {
				res.status(404).json({
					success: false,
					message: "Seller not found",
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "Account deleted successfully",
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Failed to delete account",
				error: error.message,
			});
			return;
		}
	}

	/**
	 * Manage all user
	 */
	public async getAllUsers(req: Request, res: Response): Promise<void> {
		try {
			const users = await Seller.find();
			const sellers = await User.find();
			const allUsers = [...users, ...sellers];
			res.status(200).json({
				success: true,
				message: "Users retrieved successfully",
				data: allUsers,
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Failed to fetch users account",
				error: error.message,
			});
			return;
		}
	}
	/**
	 * Manage all users order
	 */
	public async getAllOrders(req: Request, res: Response): Promise<void> {
		try {
			const orders = await Order.find();
			res.status(200).json({
				success: true,
				message: "Orders retrieved successfully",
				data: orders,
			});
			return;
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: "Failed to fetch orders account",
				error: error.message,
			});
			return;
		}
	}
}

export default SellerController;
