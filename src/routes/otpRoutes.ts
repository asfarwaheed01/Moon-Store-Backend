import express from "express";
import verifyOtp from "../controllers/otpController";
const router = express.Router();

router.post("/verify-otp", verifyOtp);

export default router;
