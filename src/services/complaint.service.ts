import { ComplaintModel } from "../models/complaint.model";
import { IComplaint } from "../types/interfaces";

export class ComplaintService {
	public async findAll(): Promise<IComplaint[]> {
		return await ComplaintModel.find();
	}

	public async findByComplaintNumber(
		complaintNumber: string
	): Promise<IComplaint | null> {
		return await ComplaintModel.findOne({ complaintNumber });
	}

	public async create(complaintData: Partial<IComplaint>): Promise<IComplaint> {
		const complaint = new ComplaintModel(complaintData);
		return await complaint.save();
	}

	public async updateStatus(
		complaintNumber: string,
		status: string
	): Promise<IComplaint | null> {
		return await ComplaintModel.findOneAndUpdate(
			{ complaintNumber },
			{ $set: { status } },
			{ new: true }
		);
	}
}
