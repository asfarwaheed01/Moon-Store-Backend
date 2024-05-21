import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import User from "../db/model/userModel";
import OTP from "../db/model/otp";
import createToken from "../utils/createToken";

const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const otpEntry = await OTP.findOne({ email, otp });

  if (!otpEntry) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await OTP.deleteOne({ _id: otpEntry._id });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const token = createToken(res, existingUser._id);
    return res.status(200).json({
      message: "Admin login successful",
      user: existingUser,
      token,
    });
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized: Only admins can login" });
  }
});

export default verifyOtp;
