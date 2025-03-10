import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
	try {
		if (!process.env.MONGO_URI) {
			throw new Error("MONGO_URI is not defined in environment variables");
		}
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};
