import { Request, Response } from "express";
import Product, {
  CATEGORIES,
  PRICE_RANGES,
  getPriceRange,
} from "../models/Product";
import { Op } from "sequelize";

// Get all products (for dropdown)
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.findAll({
      order: [
        ["category", "ASC"],
        ["name", "ASC"],
      ],
    });

    // Add price range to each product for frontend
    const productsWithRanges = products.map((product) => ({
      ...product.toJSON(),
      priceRange: product.getPriceRange(),
      formattedPrice: product.getFormattedPrice(),
    }));

    res.status(200).json({
      products: productsWithRanges,
      categories: CATEGORIES,
      priceRanges: PRICE_RANGES,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

// Get products by category (optional filter)
export const getProductsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.params;

    const products = await Product.findAll({
      where: { category },
      order: [["name", "ASC"]],
    });

    const productsWithRanges = products.map((product) => ({
      ...product.toJSON(),
      priceRange: product.getPriceRange(),
      formattedPrice: product.getFormattedPrice(),
    }));

    res.status(200).json({ products: productsWithRanges });
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ error: "Failed to get products by category" });
  }
};

// Get products by price range
export const getProductsByPriceRange = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { range } = req.params;

    let whereClause: any;
    switch (range) {
      case "Under £20":
        whereClause = { price: { [Op.lt]: 20 } };
        break;
      case "£20-£50":
        whereClause = { price: { [Op.between]: [20, 49.99] } };
        break;
      case "£50-£100":
        whereClause = { price: { [Op.between]: [50, 99.99] } };
        break;
      case "£100-£200":
        whereClause = { price: { [Op.between]: [100, 199.99] } };
        break;
      case "Over £200":
        whereClause = { price: { [Op.gte]: 200 } };
        break;
      default:
        res.status(400).json({ error: "Invalid price range" });
        return;
    }

    const products = await Product.findAll({
      where: whereClause,
      order: [["price", "ASC"]],
    });

    const productsWithRanges = products.map((product) => ({
      ...product.toJSON(),
      priceRange: product.getPriceRange(),
      formattedPrice: product.getFormattedPrice(),
    }));

    res.status(200).json({ products: productsWithRanges });
  } catch (error) {
    console.error("Get products by price range error:", error);
    res.status(500).json({ error: "Failed to get products by price range" });
  }
};

// Create a new product (admin only - mainly for seeding)
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, category, price } = req.body;

    // Validation
    if (!name || !category || price === undefined) {
      res.status(400).json({
        error: "All fields are required: name, category, price",
      });
      return;
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({
      where: { name, category },
    });

    if (existingProduct) {
      res
        .status(409)
        .json({ error: "Product already exists in this category" });
      return;
    }

    // Create the product
    const product = await Product.create({
      name,
      category,
      price: parseFloat(price),
    });

    res.status(201).json({
      message: "Product created successfully",
      product: {
        ...product.toJSON(),
        priceRange: product.getPriceRange(),
        formattedPrice: product.getFormattedPrice(),
      },
    });
  } catch (error: any) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Get single product by ID
export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json({
      product: {
        ...product.toJSON(),
        priceRange: product.getPriceRange(),
        formattedPrice: product.getFormattedPrice(),
      },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to get product" });
  }
};
