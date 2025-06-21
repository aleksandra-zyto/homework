import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

// Extend the Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

// Middleware to protect routes that require authentication
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    // Verify the token
    const decoded = verifyToken(token);

    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
