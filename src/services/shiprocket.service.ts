import axios from "axios";
import crypto from "crypto";
import "dotenv/config";
import { CartData, ShiprocketAuthResponse } from "../types/interfaces";

class ShiprocketService {
	private static instance: ShiprocketService;
	private token: string | null = null;
	private tokenExpiry: Date | null = null;

	constructor() {
		this.validateEnvironmentVariables();
	}

	private validateEnvironmentVariables() {
		const requiredEnvVars = [
			"SHIPROCKET_URL",
			"SHIPROCKET_EMAIL",
			"SHIPROCKET_PASSWORD",
			"SHIPROCKET_SECRET",
			"REDIRECT_URL",
		];

		const missingVars = requiredEnvVars.filter(
			(varName) => !process.env[varName]
		);

		if (missingVars.length) {
			throw new Error(
				`Missing required environment variables: ${missingVars.join(", ")}`
			);
		}
	}

	public static getInstance(): ShiprocketService {
		if (!ShiprocketService.instance) {
			ShiprocketService.instance = new ShiprocketService();
		}
		return ShiprocketService.instance;
	}

	private calculateHmacSha256(content: string): string {
		const secret = process.env.SHIPROCKET_SECRET;
		if (!secret) {
			throw new Error("SHIPROCKET_SECRET environment variable is not set");
		}

		try {
			return crypto
				.createHmac("sha256", secret)
				.update(content)
				.digest("base64");
		} catch (error) {
			console.error("Error calculating HMAC:", error);
			throw new Error("Failed to calculate HMAC signature");
		}
	}
	private async refreshToken(): Promise<void> {
		const url = process.env.SHIPROCKET_URL?.concat("/auth/login");
		console.log("Attempting to connect to URL:", url);
		console.log("Using email:", process.env.SHIPROCKET_EMAIL);

		if (!url) {
			throw new Error("SHIPROCKET_URL environment variable is not set");
		}

		try {
			const response = await axios.post<ShiprocketAuthResponse>(url, {
				email: process.env.SHIPROCKET_EMAIL,
				password: process.env.SHIPROCKET_PASSWORD,
			});

			// Log the entire response
			console.log(
				"Shiprocket Response:",
				JSON.stringify(response.data, null, 2)
			);

			const token = response.data.token;
			console.log("Ship to rocket token: ", token);

			this.token = token;
			this.tokenExpiry = new Date(response.data.expires_at);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Axios Error Details:", {
					status: error.response?.status,
					statusText: error.response?.statusText,
					data: error.response?.data,
					headers: error.response?.headers,
				});
			}
			console.error("Failed to refresh Shiprocket token:", error);
			throw new Error(
				error instanceof Error
					? `Shiprocket authentication failed: ${error.message}`
					: "Shiprocket authentication failed"
			);
		}
	}

	private async ensureValidToken(): Promise<string> {
		if (!this.token || !this.tokenExpiry || new Date() > this.tokenExpiry) {
			await this.refreshToken();
		}
		return this.token!;
	}

	public async createOrder(cartData: CartData): Promise<string> {
		if (!cartData.items || cartData.items.length === 0) {
			throw new Error("Invalid cart data: Cart must contain items");
		}

		const token = await this.ensureValidToken();
		const timestamp = new Date().toISOString();

		const payload = {
			cart_data: cartData,
			redirect_url: process.env.REDIRECT_URL,
			timestamp,
		};

		const signature = this.calculateHmacSha256(JSON.stringify(payload));

		try {
			const response = await axios.post(process.env.SHIPROCKET_URL!, payload, {
				headers: {
					Authorization: `Bearer ${token}`,
					"X-Api-HMAC-SHA256": signature,
					"Content-Type": "application/json",
				},
			});

			if (!response.data?.result?.token) {
				throw new Error("Invalid response from Shiprocket: Missing token");
			}

			return response.data.result.token;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Shiprocket API Error:", {
					status: error.response?.status,
					data: error.response?.data,
				});
				throw new Error(
					`Shiprocket API Error: ${
						error.response?.data?.message || error.message
					}`
				);
			}
			throw error;
		}
	}
}

export default new ShiprocketService();
