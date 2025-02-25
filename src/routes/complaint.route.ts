import express from "express";
import { ComplaintController } from "../controllers/complaint.controller";

const router = express.Router();
const complaintController = new ComplaintController();

router.post("/post-complaints", complaintController.postComplaint);

// Get all complaints route
router.get("/get-complaints", complaintController.getAllComplaints);

// Update complaint status route
router.put(
	"/update-complaint-status",
	complaintController.updateComplaintStatus
);

export default router;
