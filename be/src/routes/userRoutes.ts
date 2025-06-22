import { Router } from "express";
import { createUser, deleteUser, getUser } from "../controllers/userController";

const router = Router();

// POST /api/users - Create a new user
router.post("/", createUser);

// GET /api/users/:id - Get a user by ID
router.get("/:id", getUser);

// DELETE /api/users/:id - Delete a user by ID
router.delete("/:id", deleteUser);

export default router;
