import mongoose, { Document, Schema } from "mongoose";
import { IComplaint } from "../types/interfaces";

const complaintSchema = new Schema<IComplaint>(
	{
		complaintNumber: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		userType: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "in-progress", "resolved", "closed"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

export const ComplaintModel = mongoose.model<IComplaint>(
	"Complaint",
	complaintSchema
);
