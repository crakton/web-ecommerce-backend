import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define interface for Cloudinary upload result
interface CloudinaryUploadResult {
	public_id: string;
	secure_url: string;
	[key: string]: any;
}

export class CloudinaryService {
	private cloudinaryV2: typeof cloudinary.v2;

	constructor() {
		// Initialize cloudinary
		this.cloudinaryV2 = cloudinary.v2;

		// Configure Cloudinary
		this.cloudinaryV2.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
			api_key: process.env.CLOUDINARY_API_KEY as string,
			api_secret: process.env.CLOUDINARY_API_SECRET as string,
		});
	}

	/**
	 * Upload an image to Cloudinary
	 * @param filePath Path to the file to upload
	 * @param options Optional upload options
	 * @returns Promise with upload result
	 */
	public async uploadImage(
		filePath: string,
		options: cloudinary.UploadApiOptions = {}
	): Promise<CloudinaryUploadResult> {
		const defaultOptions = {
			folder: "uploads",
			...options,
		};

		return (await this.cloudinaryV2.uploader.upload(
			filePath,
			defaultOptions
		)) as CloudinaryUploadResult;
	}

	/**
	 * Delete an image from Cloudinary
	 * @param publicId Public ID of the image to delete
	 * @returns Promise with deletion result
	 */
	public async deleteImage(
		publicId: string
	): Promise<cloudinary.DeleteApiResponse> {
		return await this.cloudinaryV2.uploader.destroy(publicId);
	}
}
