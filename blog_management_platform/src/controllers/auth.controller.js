import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { generateToken } from "./../config/token.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const checkUser = await User.existsByEmail(email);

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "user already registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "new user create successfully",
      data: {
        id: newUser.id,
        name,
        email,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await User.findByEmail(email);

    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "user does not exist",
      });
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password);

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials",
      });
    }

    const token = generateToken(checkUser.id, checkUser.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        id: checkUser.id,
        name: checkUser.name,
        email: checkUser.email,
        role: checkUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "logout success",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: error.message,
    });
  }
};
