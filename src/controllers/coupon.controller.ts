import { Request, Response } from "express";
import { CouponService } from "../services/coupon.service";
import { EmailService } from "../services/email.service";
import { ICoupon } from "../types/interfaces";

export class CouponController {
	private couponService: CouponService;
	private emailService: EmailService;

	constructor() {
		this.couponService = new CouponService();
		this.emailService = new EmailService();

		// Bind the methods to ensure 'this' context is preserved
		this.getAllCoupons = this.getAllCoupons.bind(this);
		this.saveCoupon = this.saveCoupon.bind(this);
		this.deleteCoupon = this.deleteCoupon.bind(this);
		this.updateCouponStatus = this.updateCouponStatus.bind(this);
		this.verifyCoupon = this.verifyCoupon.bind(this);
	}

	public async getAllCoupons(req: Request, res: Response): Promise<void> {
		try {
			const coupons = await this.couponService.findAll();
			res.status(200).json({
				success: true,
				coupons,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error fetching coupons",
				error: (error as Error).message,
			});
		}
	}

	public async saveCoupon(req: Request, res: Response): Promise<void> {
		try {
			const { code, discountPercentage, name, status } = req.body;

			const coupon = await this.couponService.create({
				code,
				discountPercentage,
				name,
				status,
			} as ICoupon);

			res.status(201).json({
				success: true,
				message: "Coupon saved successfully",
				coupon,
			});

			// Send email to all users about new coupon
			const subject = "New Coupon Available!";
			const message = `A new coupon ${code} is now available with ${discountPercentage}% discount. Use it in your next purchase!`;
			await this.emailService.sendEmailToAllUsers(subject, message);
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error saving coupon",
				error: (error as Error).message,
			});
		}
	}

	public async deleteCoupon(req: Request, res: Response): Promise<void> {
		try {
			const { code } = req.body;
			const deletedCoupon = await this.couponService.deleteByCode(code);

			if (deletedCoupon) {
				res.status(200).json({
					success: true,
					message: `Coupon with code ${code} deleted successfully`,
				});
			} else {
				res.status(404).json({
					success: false,
					message: `Coupon with code ${code} not found`,
				});
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error deleting coupon",
				error: (error as Error).message,
			});
		}
	}

	public async updateCouponStatus(req: Request, res: Response): Promise<void> {
		try {
			const { code, status } = req.body;
			const updatedCoupon = await this.couponService.updateStatus(code, status);

			if (updatedCoupon) {
				res.status(200).json({
					success: true,
					message: `Status of coupon with code ${code} updated successfully`,
				});
			} else {
				res.status(404).json({
					success: false,
					message: `Coupon with code ${code} not found`,
				});
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error updating coupon status",
				error: (error as Error).message,
			});
		}
	}

	public async verifyCoupon(req: Request, res: Response): Promise<void> {
		try {
			const { code } = req.body;
			const coupon = await this.couponService.findByCode(code);

			if (!coupon) {
				res.status(404).json({
					success: false,
					message: "Coupon not found",
				});
				return;
			}

			if (coupon.status === "active") {
				res.status(200).json({
					success: true,
					message: "Coupon is valid and active",
					coupon,
				});
			} else if (coupon.status === "expired") {
				res.status(200).json({
					success: false,
					message: "Coupon has expired",
				});
			} else {
				res.status(200).json({
					success: false,
					message: `Coupon is not active (status: ${coupon.status})`,
				});
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error verifying coupon",
				error: (error as Error).message,
			});
		}
	}
}
