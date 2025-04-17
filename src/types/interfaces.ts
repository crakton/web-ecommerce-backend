import { Schema, model, Document } from "mongoose";
import { EBusinessType, ELoginStatus, ERole } from "../enums";

export interface ShiprocketAuthResponse {
	token: string;
	expires_at: string;
}

export interface ShiprocketOrder {
	order_id: string;
	shipment_id: string;
}

export interface CartItem {
	variant_id: string;
	quantity: number;
}

export interface CartData {
	items: CartItem[];
}

export interface Product {
	_id: string;
	productId: string;
	name: string;
	price: number;
	category: string;
	inStockValue: number;
	soldStockValue: number;
	img: string;
	rating: number;
	visibility: "on" | "off";
}

export interface CartProduct {
	productId: string;
	quantity: number;
	price: number;
	name: string;
	category: string;
	img: string[];
}

export interface OrderDetails {
	orderId: string;
	trackingDetails?: {
		provider: string;
		trackingNumber: string;
		status: string;
	};
}
export interface ICart extends Document {
	cartId: string;
	userId: string;
	productsInCart: CartProduct[];
	total: number;
	updatedAt: Date;
}

export interface IOrder extends Document {
	orderId: string;
	userId: string;
	date: string;
	time: string;
	address: string;
	email: string;
	name: string;
	productIds: string[];
	products: {
		productId: string;
		name: string;
		price: number;
		quantity: number;
		img: string[];
		category: string;
	}[];
	trackingId?: string;
	price: number;
	status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
	paymentStatus: "Paid" | "Unpaid" | "Failed" | "Refunded" | "Pending";
	createdAt: Date;
	updatedAt?: Date;
	paymentMethod?: "Credit Card" | "Debit Card" | "Net Banking" | "UPI" | "COD";
	paymentReference?: string;
}

export interface IProduct extends Document {
	name: string;
	price: number;
	img: string[];
	category: string;
	description: string;
	rating: number;
	productId: string;
	inStockValue: number;
	soldStockValue: number;
	visibility: "on" | "off";
}

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	userId: string;
	accountStatus: string;
	phone: string;
	comparePassword(password: string): Promise<boolean>;
}

export interface IReview extends Document {
	productId: string;
	userId: string;
	review: string;
	rating: number;
	verified: boolean;
	createdAt: Date;
}

export interface ICoupon extends Document {
	code: string;
	discountPercentage: number;
	name: string;
	status: "active" | "expired" | "disabled";
}

export interface IComplaint extends Document {
	complaintNumber: string;
	name: string;
	email: string;
	message: string;
	userType: string;
	status: "pending" | "in-progress" | "resolved" | "closed";
	createdAt: Date;
	updatedAt: Date;
}

// Define Seller interface extending Document
export interface ISeller extends Document {
	name: string;
	email: string;
	password: string;
	sellerId: string;
	emailVerified: boolean;
	phoneVerified: boolean;
	phoneNumber: string;
	businessName: string;
	businessAddress: string;
	businessType?: EBusinessType;
	otp?: string;
	role: ERole;
	loggedIn: ELoginStatus;
	comparePassword(password: string): Promise<boolean>;
}

export interface ISellerRegistrationDTO {
	name: string;
	email: string;
	password: string;
	phoneNumber: string;
	businessName: string;
	businessAddress: string;
	businessType: EBusinessType;
}

export interface ISellerLoginDTO {
	email: string;
	password: string;
}

export interface ISellerResponseDTO {
	id: string;
	name: string;
	email: string;
	sellerId: string;
	emailVerified: boolean;
	phoneVerified: boolean;
	phoneNumber: string;
	businessName: string;
	businessAddress: string;
	businessType: string;
}

export interface IVerifyOtpDTO {
	email: string;
	otp: string;
	type: "email" | "phone";
}

export interface IUpdateSellerDTO {
	name?: string;
	phoneNumber?: string;
	businessName?: string;
	businessAddress?: string;
	businessType?: EBusinessType;
}

export interface IChangePasswordDTO {
	currentPassword: string;
	newPassword: string;
}

export interface IApiResponse<T> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
}
