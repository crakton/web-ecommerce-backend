import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export interface PaystackInitiatePaymentResponse {
	status: boolean;
	message: string;
	data: {
		authorization_url: string;
		access_code: string;
		reference: string;
	};
}

export interface PaystackVerifyPaymentResponse {
	status: boolean;
	message: string;
	data: {
		status: string;
		reference: string;
		amount: number;
		paid_at: string;
		channel: string;
		currency: string;
		customer: {
			email: string;
			name: string;
		};
		metadata: any;
		[key: string]: any;
	};
}

export class PaystackService {
	private baseUrl: string = "https://api.paystack.co";
	private secretKey: string;

	constructor() {
		this.secretKey = process.env.PAYSTACK_SECRET_KEY as string;

		if (!this.secretKey) {
			console.error(
				"PAYSTACK_SECRET_KEY is not defined in environment variables"
			);
			throw new Error("Paystack secret key is required");
		}
	}

	/**
	 * Initialize a payment transaction
	 * @param email Customer email
	 * @param amount Amount in kobo (Naira * 100)
	 * @param reference Optional unique transaction reference
	 * @param metadata Optional additional data to store with transaction
	 * @param callbackUrl URL to redirect to after payment
	 * @returns Promise with payment initialization result
	 */
	public async initiatePayment(
		email: string,
		amount: number,
		reference?: string,
		metadata?: any,
		callbackUrl?: string
	): Promise<PaystackInitiatePaymentResponse> {
		try {
			const response = await axios.post(
				`${this.baseUrl}/transaction/initialize`,
				{
					email,
					amount: Math.round(amount) * 100, // coverts from kobo to naira
					reference,
					metadata,
					callback_url: callbackUrl,
				},
				{
					headers: {
						Authorization: `Bearer ${this.secretKey}`,
						"Content-Type": "application/json",
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error("[PaystackService] Payment initiation failed:", error);
			throw error;
		}
	}

	/**
	 * Verify a payment transaction
	 * @param reference Transaction reference
	 * @returns Promise with verification result
	 */
	public async verifyPayment(
		reference: string
	): Promise<PaystackVerifyPaymentResponse> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/transaction/verify/${reference}`,
				{
					headers: {
						Authorization: `Bearer ${this.secretKey}`,
						"Content-Type": "application/json",
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error("[PaystackService] Payment verification failed:", error);
			throw error;
		}
	}

	/**
	 * List banks available in Nigeria
	 * @returns Promise with list of banks
	 */
	public async listBanks() {
		try {
			const response = await axios.get(`${this.baseUrl}/bank`, {
				headers: {
					Authorization: `Bearer ${this.secretKey}`,
					"Content-Type": "application/json",
				},
			});

			return response.data;
		} catch (error) {
			console.error("[PaystackService] Fetching banks failed:", error);
			throw error;
		}
	}
}
