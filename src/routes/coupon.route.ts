import express from "express";
import { CouponController } from "../controllers/coupon.controller";

const router = express.Router();
const couponController = new CouponController();

router.get("/get-coupons", couponController.getAllCoupons);

// Save coupon route
router.post("/save-coupons", couponController.saveCoupon);

// Delete coupon route
router.delete("/delete-coupons", couponController.deleteCoupon);

// Update status route
router.put("/update-status", couponController.updateCouponStatus);

// Verify coupon route
router.post("/verify-coupons", couponController.verifyCoupon);

export default router;
