import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token ||req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication failed. Please login again",
      data: error.message,
    });
  }
};
