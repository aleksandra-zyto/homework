import { Router } from "express";
import {
  getProducts,
  getProductsByCategory,
  getProductsByPriceRange,
  createProduct,
  getProduct,
} from "../controllers/productController";

const router = Router();

// GET /api/products - Get all products (for dropdown)
router.get("/", getProducts);

// GET /api/products/category/:category - Get products by category
router.get("/category/:category", getProductsByCategory);

// GET /api/products/price/:range - Get products by price range
router.get("/price/:range", getProductsByPriceRange);

// GET /api/products/:id - Get single product
router.get("/:id", getProduct);

// POST /api/products - Create product (mainly for seeding)
router.post("/", createProduct);

export default router;
