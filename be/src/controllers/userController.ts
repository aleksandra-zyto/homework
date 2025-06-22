import { Request, Response } from "express";
import User from "../models/User";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    console.log(user);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userResponse = user.toJSON();

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, firstName, lastName, password } = req.body;

    // Simple validation
    if (!email || !firstName || !lastName || !password) {
      res.status(400).json({
        error: "All fields are required: email, firstName, lastName, password",
      });
      return;
    }

    // Create the user
    const user = await User.create({
      email,
      firstName,
      lastName,
      password,
    });

    const userResponse = user.toJSON();
    userResponse.id = user.id;

    res.status(201).json(userResponse);
  } catch (error: any) {
    console.error("Create user error:", error);

    // Handle unique constraint errors (duplicate email)
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    res.status(500).json({ error: "Failed to create user" });
  }
};

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await user.destroy();

    res.status(200).json({
      id: user.dataValues.id,
      email: user.dataValues.email,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
