import jwt from "jsonwebtoken";

// What we store in the JWT token
interface JwtPayload {
  userId: number;
  email: string;
}

// Generate a JWT token for a user
export const generateToken = (userId: number, email: string): string => {
  const payload: JwtPayload = {
    userId,
    email,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  // Type assertion to help TypeScript understand the types
  return jwt.sign(
    payload,
    secret as jwt.Secret,
    { expiresIn } as jwt.SignOptions
  );
};

// Verify and decode a JWT token
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
