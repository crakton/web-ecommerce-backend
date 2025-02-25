import { CouponModel } from "../models/coupon.model";
import { ICoupon } from "../types/interfaces";

export class CouponService {
	public async findAll(): Promise<ICoupon[]> {
		return await CouponModel.find();
	}

	public async findByCode(code: string): Promise<ICoupon | null> {
		return await CouponModel.findOne({ code });
	}

	public async create(couponData: ICoupon): Promise<ICoupon> {
		const coupon = new CouponModel(couponData);
		return await coupon.save();
	}

	public async deleteByCode(code: string): Promise<ICoupon | null> {
		return await CouponModel.findOneAndDelete({ code });
	}

	public async updateStatus(
		code: string,
		status: string
	): Promise<ICoupon | null> {
		return await CouponModel.findOneAndUpdate(
			{ code },
			{ status },
			{ new: true }
		);
	}
}
