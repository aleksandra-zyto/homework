import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, firstName, lastName, password } = req.body;

    // Validation
    if (!email || !firstName || !lastName || !password) {
      res.status(400).json({
        error: "All fields are required: email, firstName, lastName, password",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    // Create the user (password will be hashed automatically by the hook)
    const user = await User.create({
      email,
      firstName,
      lastName,
      password,
    });

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    // Return user data WITHOUT password and token
    res.status(201).json({
      message: "User registered successfully",
      user: user.toSafeJSON(), // This method excludes the password
      token,
    });
  } catch (error: any) {
    console.error("Register error:", error);

    // Handle validation errors (like password requirements)
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
      return;
    }

    // Handle unique constraint errors (duplicate email)
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    res.status(500).json({ error: "Failed to register user" });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        error: "Email and password are required",
      });
      return;
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({ error: "Account is deactivated" });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    // Return user data WITHOUT password and token
    res.status(200).json({
      message: "Login successful",
      user: user.toSafeJSON(), // This method excludes the password
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

// Get current user profile (requires authentication)
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // We'll get the user from the auth middleware (we'll create this next)
    const userId = (req as any).user.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      user: user.toSafeJSON(), // This method excludes the password
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};
