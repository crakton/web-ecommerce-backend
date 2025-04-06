import express, { Router } from "express";
import { UploadController } from "../controllers/upload.controller";

const router = Router();
const uploadController = new UploadController();

// Single file upload route - no additional middleware
router.post("/doc-upload", uploadController.uploadImage);

// Multiple files upload route - no additional middleware
router.post("/docs-upload", uploadController.uploadMultipleImages);

export default router;
