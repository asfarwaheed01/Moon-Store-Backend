import jwt from "jsonwebtoken";
import User from "../db/model/userModel";
import asyncHandler from "./asyncHandler";
import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: any;
}

// const authenticate = asyncHandler(
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     let token;
//     token = req.cookies.jwt;
//     if (token) {
//       try {
//         const decoded: any = jwt.verify(
//           token,
//           process.env.JWT_SECRET || "as20394sdalkshd"
//         );
//         req.user = await User.findById(decoded.userId).select("-password");
//         next();
//       } catch (error) {
//         res.status(401);
//         throw new Error("Not Authorized, token failed.");
//       }
//     } else {
//       res.status(401);
//       throw new Error("Not Authorized, no Token.");
//     }
//   }
// );

// const authorizeAdmin = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.user && req.user.isAdmin) {
//     next();
//   } else {
//     res.status(401).send("Not authorized as an Admin.");
//   }
// };

// export { authenticate, authorizeAdmin };

const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      try {
        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET || "as20394sdalkshd"
        );
        const user = await User.findById(decoded.userId).select("-password");

        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).json({ message: "User not found" });
        }
      } catch (error) {
        res.status(401).json({ message: "Not Authorized, token failed." });
      }
    } else {
      res.status(401).json({ message: "Not Authorized, no Token." });
    }
  }
);

// Middleware to authorize admin users
const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an Admin." });
  }
};

export { authenticate, authorizeAdmin };
