import { Router } from "express";
import {
  createReview,
  getReviews,
  getAnalytics,
  getReview,
} from "../controllers/reviewController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /api/reviews - Create a new review
router.post("/", createReview);

// GET /api/reviews - Get all reviews with pagination and filtering
router.get("/", getReviews);

// GET /api/reviews/analytics - Get analytics data for dashboard
router.get("/analytics", getAnalytics);

// GET /api/reviews/:id - Get single review
router.get("/:id", getReview);

export default router;
