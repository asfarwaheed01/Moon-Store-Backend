import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../db/model/userModel";
import asyncHandler from "../middleware/asyncHandler";
import createToken from "../utils/createToken";

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
    createToken(res, newUser._id);
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "as20394sdalkshd",
      {
        expiresIn: "6d",
      }
    );
    // res.status(201).json({
    //   _id: newUser._id,
    //   username: newUser.username,
    //   email: newUser.email,
    //   isAdmin: newUser.isAdmin,
    //   access_token: token,
    // });
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
      createToken(res, existingUser._id);
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET || "as20394sdalkshd",
        {
          expiresIn: "6d",
        }
      );

      // res.status(200).json({
      //   _id: existingUser._id,
      //   username: existingUser.username,
      //   email: existingUser.email,
      //   isAdmin: existingUser.isAdmin,
      //   access_token: token,
      // });
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
};
