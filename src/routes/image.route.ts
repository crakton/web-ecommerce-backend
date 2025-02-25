import express, { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });
const uploadController = new UploadController();
// Image upload route
router.post(
	"/image-upload",
	upload.single("image"),
	uploadController.uploadImage
);

export default router;
