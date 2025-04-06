import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { CloudinaryService } from "../services/cloudinary.service";
import { UploadedFile } from "express-fileupload";

export class UploadController {
	private cloudinaryService: CloudinaryService;

	constructor() {
		this.cloudinaryService = new CloudinaryService();
		this.uploadImage = this.uploadImage.bind(this);
		this.uploadMultipleImages = this.uploadMultipleImages.bind(this);
	}

	public async uploadImage(req: Request, res: Response): Promise<void> {
		try {
			if (!req.files || !req.files.files) {
				res.status(400).json({
					success: false,
					message: "No image file provided",
				});
				return;
			}

			const file = req.files.files as UploadedFile;

			// Validate file type
			if (!file.mimetype.startsWith("image/")) {
				res.status(400).json({
					success: false,
					message: "Only image files are allowed",
				});
				return;
			}

			const uploadPath = path.join(
				__dirname,
				"..",
				"uploads",
				`${Date.now()}-${file.name}`
			);

			// Move the file to uploads directory
			await file.mv(uploadPath);

			// Upload the image to Cloudinary
			const uploadResult = await this.cloudinaryService.uploadImage(uploadPath);

			// Delete the file from the server after uploading
			fs.unlinkSync(uploadPath);

			res.status(200).json({
				success: true,
				message: "Image uploaded successfully",
				imageUrl: uploadResult.secure_url,
			});
		} catch (error) {
			console.error("Upload error:", error);
			res.status(500).json({
				success: false,
				message: "Error uploading image",
				error: (error as Error).message,
			});
		}
	}

	public async uploadMultipleImages(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			if (!req.files || !req.files.files) {
				res.status(400).json({
					success: false,
					message: "No images provided",
				});
				return;
			}

			let files: UploadedFile[] = [];

			// Handle both single file and array of files
			if (Array.isArray(req.files.files)) {
				files = req.files.files as UploadedFile[];
			} else {
				files = [req.files.files as UploadedFile];
			}

			// Validate files
			for (const file of files) {
				if (!file.mimetype.startsWith("image/")) {
					res.status(400).json({
						success: false,
						message: `File ${file.name} is not an image`,
					});
					return;
				}
			}

			// Process each file
			const uploadPaths: string[] = [];
			for (const file of files) {
				const uploadPath = path.join(
					__dirname,
					"..",
					"uploads",
					`${Date.now()}-${file.name}`
				);
				await file.mv(uploadPath);
				uploadPaths.push(uploadPath);
			}

			// Upload all images to Cloudinary
			const uploadResults = await Promise.all(
				uploadPaths.map((path) => this.cloudinaryService.uploadImage(path))
			);

			// Clean up files
			uploadPaths.forEach((path) => fs.unlinkSync(path));

			res.status(200).json({
				success: true,
				message: "Images uploaded successfully",
				imageUrls: uploadResults.map((result) => result.secure_url),
			});
		} catch (error) {
			console.error("Upload error:", error);
			res.status(500).json({
				success: false,
				message: "Error uploading images",
				error: (error as Error).message,
			});
		}
	}
}
