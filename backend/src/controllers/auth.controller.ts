import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { generateToken, setAuthCookie, clearAuthCookie } from "../utils/jwt.js";
import type { AuthRequest } from "../middleware/auth.js";
import { z } from "zod";

const signupSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  mobile: z.string().optional(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { fullName, email, mobile, password } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        fullName,
        email,
        ...(mobile !== undefined ? { mobile } : {}),
        password: hashedPassword,
        role: "user",
    });

    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Invalid input", errors: error.issues });
    } else {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Invalid input", errors: error.issues });
    } else {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};

export const logout = (req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Logout successful" });
};

export const getMe = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthenticated" });
    return;
  }
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
};
