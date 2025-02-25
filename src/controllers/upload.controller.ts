import { Request, Response } from "express";

import fs from "fs";
import { CloudinaryService } from "../services/cloudinary.service";

export class UploadController {
	private cloudinaryService: CloudinaryService;

	constructor() {
		this.cloudinaryService = new CloudinaryService();

		// Bind the methods to ensure 'this' context is preserved
		this.uploadImage = this.uploadImage.bind(this);
	}

	public async uploadImage(req: Request, res: Response): Promise<void> {
		try {
			// Get the uploaded file from Multer
			if (!req.file) {
				res.status(400).json({
					success: false,
					message: "No image file provided",
				});
				return;
			}

			const filePath = req.file.path;

			// Upload the image to Cloudinary
			const uploadResult = await this.cloudinaryService.uploadImage(filePath);

			// Delete the file from the server after uploading
			fs.unlinkSync(filePath);

			// Respond with the Cloudinary URL
			res.status(200).json({
				success: true,
				message: "Image uploaded successfully",
				imageUrl: uploadResult.secure_url,
			});
		} catch (error) {
			// Handle errors
			res.status(500).json({
				success: false,
				message: "Error uploading image",
				error: (error as Error).message,
			});
		}
	}
}
