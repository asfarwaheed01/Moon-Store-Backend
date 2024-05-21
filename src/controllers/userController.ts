import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../db/model/userModel";
import asyncHandler from "../middleware/asyncHandler";
import createToken from "../utils/createToken";
import OTP from "../db/model/otp";
import { sendEmail } from "../utils/mailSender";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please Fill in all the input fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).send("User already Exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    const token = createToken(res, newUser._id);
    res.status(201).json({
      newUser,
      token,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      const token = createToken(res, existingUser._id);
      res.status(200).json({
        existingUser,
        token,
      });

      return;
    }
  }

  res.status(404).send({ message: "User not found or invalid credentials." });
});

const logoutCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not Authorized, user not found.");
    }
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
  }
);

const updateCurrentUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
  }
);

const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user.");
    }
    await User.deleteOne({ _id: user._id });
    res.json({
      message: "User removed.",
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Function to generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.isAdmin) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      const otp = generateOTP();
      const otpEntry = new OTP({ email, otp });
      await otpEntry.save();
      try {
        await sendEmail({
          to: email,
          subject: "Your OTP Code",
          text: `Your OTP code is ${otp}`,
        });
        res.status(200).json({ message: "OTP sent to your email" });
      } catch (error) {
        console.error("Failed to send OTP email: ", error);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized: Only admins can login" });
  }
});

const loginGoogle = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      const token = createToken(res, user._id);
      return res.status(200).json({
        message: "Login successful",
        user,
        token,
      });
    } else {
      const username = email.split("@")[0];
      const password = Math.random().toString(36).slice(-8);
      user = new User({
        username,
        email,
        password,
      });
      await user.save();
      const token = createToken(res, user._id);
      return res.status(200).json({
        message: "User registered and logged in successfully",
        user,
        token,
      });
    }
  } catch (error) {
    console.error("Google login and user registration failed:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  adminLogin,
  loginGoogle,
};
