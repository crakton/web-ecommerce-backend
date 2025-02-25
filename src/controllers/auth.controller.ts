import { Request, Response } from "express";
import { User } from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { blacklistToken } from "../services/token.service";
export class AuthController {
	private generateToken(userId: string): string {
		return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
			expiresIn: "24h",
		});
	}

	public async register(req: Request, res: Response): Promise<void> {
		try {
			const { name, email, password, phone } = req.body;

			// Check if user exists
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				res.status(400).json({ status: false, message: "User already exists" });
				return;
			}

			// Hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			// Create user
			const user = new User({
				name,
				email,
				password: hashedPassword,
				userId: uuidv4(),
				phone: phone || "not available",
			});

			await user.save();

			// Generate token
			const token = this.generateToken(user.userId);

			res.status(201).json({
				status: true,
				token,
				user: {
					userId: user.userId,
					name: user.name,
					email: user.email,
					phone: user.phone,
				},
				message: "User registered successfully.",
			});
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error registering user", error });
		}
	}

	public async login(req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;

			// Find user
			const user = await User.findOne({ email });
			if (!user) {
				res.status(401).json({ status: false, message: "Invalid credentials" });
				return;
			}

			// Verify password
			const isPasswordValid = await user.comparePassword(password);
			if (!isPasswordValid) {
				res.status(401).json({ status: false, message: "Invalid credentials" });
				return;
			}

			// Generate token
			const token = this.generateToken(user.userId);

			res.status(200).json({
				status: true,
				token,
				user: {
					userId: user.userId,
					name: user.name,
					email: user.email,
					phone: user.phone,
				},
				message: "Login successfully",
			});
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error logging in", error });
		}
	}

	public async updateUser(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const updateData = req.body;

			// Remove sensitive fields from update data
			delete updateData.password;
			delete updateData.email;
			delete updateData.userId;

			const user = await User.findOneAndUpdate({ userId }, updateData, {
				new: true,
			});

			if (!user) {
				res.status(404).json({ status: false, message: "User not found" });
				return;
			}

			res.status(200).json({
				status: true,
				user: {
					userId: user.userId,
					name: user.name,
					email: user.email,
					phone: user.phone,
					accountStatus: user.accountStatus,
				},
				message: "Updated user profile successfully",
			});
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error updating user", error });
		}
	}

	public async changePassword(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const { currentPassword, newPassword } = req.body;

			const user = await User.findOne({ userId });
			if (!user) {
				res.status(404).json({ status: false, message: "User not found" });
				return;
			}

			// Verify current password
			const isPasswordValid = await user.comparePassword(currentPassword);
			if (!isPasswordValid) {
				res
					.status(401)
					.json({ status: false, message: "Current password is incorrect" });
				return;
			}

			// Hash new password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);

			user.password = hashedPassword;
			await user.save();

			res
				.status(200)
				.json({ status: true, message: "Password updated successfully" });
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error changing password", error });
		}
	}

	public async getUserProfile(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const user = await User.findOne({ userId });

			if (!user) {
				res.status(404).json({ status: false, message: "User not found" });
				return;
			}

			res.status(200).json({
				status: true,
				user: {
					userId: user.userId,
					name: user.name,
					email: user.email,
					phone: user.phone,
					accountStatus: user.accountStatus,
				},
				message: "Updated profile successfully",
			});
		} catch (error) {
			res
				.status(500)
				.json({ status: false, message: "Error fetching user profile", error });
		}
	}

	public async updateAccountStatus(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.params;
			const { status } = req.body;

			const user = await User.findOneAndUpdate(
				{ userId },
				{ accountStatus: status },
				{ new: true }
			);

			if (!user) {
				res.status(404).json({ status: false, message: "User not found" });
				return;
			}

			res.status(200).json({
				status: user.accountStatus,
				message: "Account status updated successfully",
			});
		} catch (error) {
			res.status(500).json({
				status: false,
				message: "Error updating account status",
				error,
			});
		}
	}
	public async logout(req: Request, res: Response): Promise<void> {
		try {
			// Invalidate the token by adding it to a blacklist
			const token = req.headers.authorization?.split(" ")[1];
			if (token) {
				// Assuming you have a blacklist mechanism, e.g., a Redis store

				await blacklistToken(token);
			}

			res.status(200).json({
				status: true,
				message: "Logged out successfully",
			});
		} catch (error) {
			res.status(500).json({
				status: false,
				message: "Error logging out",
				error,
			});
		}
	}
}
