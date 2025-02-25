import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { EBusinessType, ELoginStatus } from "../enums";
import { ISeller } from "../types/interfaces";

// Create the schema
const SellerSchema = new Schema<ISeller>({
	name: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	sellerId: { type: String, unique: true, required: true },
	emailVerified: { type: Boolean, default: false },
	phoneVerified: { type: Boolean, default: false },
	phoneNumber: { type: String, required: true },
	businessName: { type: String, required: true },
	businessAddress: { type: String, required: true },
	EbusinessType: {
		type: String,
		required: true,
		enum: Object.values(EBusinessType),
	},
	otp: { type: String },
	loggedIn: {
		type: String,
		enum: Object.values(ELoginStatus),
		default: ELoginStatus.LOGGED_OUT,
	},
});

// Hash password before saving
SellerSchema.pre("save", async function (next) {
	// Only hash the password if it has been modified (or is new)
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error: any) {
		next(error);
	}
});

// Method to compare password
SellerSchema.methods.comparePassword = async function (
	password: string
): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

// Create and export the model
const SellerModel = mongoose.model<ISeller>("Seller", SellerSchema);
export default SellerModel;
