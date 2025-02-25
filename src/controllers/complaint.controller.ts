import { Request, Response } from "express";
import { ComplaintService } from "../services/complaint.service";
import { EmailService } from "../services/email.service";
import { IComplaint } from "../types/interfaces";

export class ComplaintController {
	private complaintService: ComplaintService;
	private emailService: EmailService;

	constructor() {
		this.complaintService = new ComplaintService();
		this.emailService = new EmailService();

		// Bind the methods to ensure 'this' context is preserved
		this.postComplaint = this.postComplaint.bind(this);
		this.getAllComplaints = this.getAllComplaints.bind(this);
		this.updateComplaintStatus = this.updateComplaintStatus.bind(this);
	}

	public async postComplaint(req: Request, res: Response): Promise<void> {
		try {
			const { name, email, message, userType } = req.body;

			// Generate 6 digit random complaint number
			const complaintNumber = Math.floor(
				100000 + Math.random() * 900000
			).toString();

			const complaintData: Partial<IComplaint> = {
				complaintNumber,
				name,
				email,
				message,
				userType,
			};

			const complaint = await this.complaintService.create(complaintData);

			// Send confirmation email
			await this.emailService.sendComplaintConfirmationEmail(
				email,
				complaintNumber,
				message
			);

			res.status(201).json({
				success: true,
				message: "Complaint registered successfully",
				complaint,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error registering complaint",
				error: (error as Error).message,
			});
		}
	}

	public async getAllComplaints(req: Request, res: Response): Promise<void> {
		try {
			const complaints = await this.complaintService.findAll();

			res.status(200).json({
				success: true,
				complaints,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error fetching complaints",
				error: (error as Error).message,
			});
		}
	}

	public async updateComplaintStatus(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { complaintId, status } = req.body;

			const updatedComplaint = await this.complaintService.updateStatus(
				complaintId,
				status
			);

			if (!updatedComplaint) {
				res.status(404).json({
					success: false,
					message: "Complaint not found",
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "Complaint status updated successfully",
				complaint: updatedComplaint,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error updating complaint status",
				error: (error as Error).message,
			});
		}
	}
}
