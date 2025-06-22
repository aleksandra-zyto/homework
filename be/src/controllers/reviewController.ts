import { Request, Response } from "express";
import Review from "../models/Review";
import Product from "../models/Product";
import { Op, QueryTypes } from "sequelize";
import sequelize from "../config/database";

// Create a new review
export const createReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, rating, comment } = req.body;

    // Validation
    if (!productId || !rating) {
      res.status(400).json({
        error: "Product ID and rating are required",
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
      return;
    }

    if (comment && comment.length > 300) {
      res.status(400).json({
        error: "Comment must be 300 characters or less",
      });
      return;
    }

    // Get the product to copy its category
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Create the review with category copied from product
    const review = await Review.create({
      productId: parseInt(productId),
      category: product.category, // Copy category from product for fast analytics
      rating: parseInt(rating),
      comment: comment || null,
    });

    // Get the created review with associated data
    const reviewWithData = await Review.findByPk(review.id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "category", "price"],
        },
      ],
    });

    res.status(201).json({
      message: "Review created successfully",
      review: reviewWithData,
    });
  } catch (error: any) {
    console.error("Create review error:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
};

// Get all reviews with pagination and filtering
export const getReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      rating,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build where clause for filtering
    const whereClause: any = {};

    if (category) {
      whereClause.category = category;
    }

    if (rating) {
      // Handle rating filters: "1-2", "3", "4-5"
      if (rating === "1-2") {
        whereClause.rating = { [Op.between]: [1, 2] };
      } else if (rating === "3") {
        whereClause.rating = 3;
      } else if (rating === "4-5") {
        whereClause.rating = { [Op.between]: [4, 5] };
      }
    }

    // Get reviews with pagination
    const { count, rows: reviews } = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "category", "price"],
        },
      ],
      order: [[sortBy as string, sortOrder as string]],
      limit: parseInt(limit as string),
      offset,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / parseInt(limit as string));
    const hasNextPage = parseInt(page as string) < totalPages;
    const hasPrevPage = parseInt(page as string) > 1;

    res.status(200).json({
      reviews,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit as string),
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ error: "Failed to get reviews" });
  }
};

// Get analytics data for dashboard
export const getAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Total reviews
    const totalReviews = await Review.count();

    // Average rating across all products
    const avgRatingResult = await Review.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
    });
    const avgRating =
      parseFloat(avgRatingResult?.get("avgRating") as string) || 0;

    // Best performing category (highest avg rating)
    const categoryRatings = await Review.findAll({
      attributes: [
        "category",
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("id")), "reviewCount"],
      ],
      group: ["category"],
      order: [[sequelize.fn("AVG", sequelize.col("rating")), "DESC"]],
    });

    const bestCategory = categoryRatings[0]?.get("category") || "N/A";

    // Rating distribution (actual counts by rating)
    const ratingDistribution = await Review.findAll({
      attributes: [
        "rating",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["rating"],
      order: [["rating", "ASC"]],
    });

    // Fixed: Most reviewed price range (using proper SQL grouping)
    const priceRangeQuery = await sequelize.query(
      `
      SELECT 
        CASE 
          WHEN p.price < 20 THEN 'Under £20'
          WHEN p.price < 50 THEN '£20-£50'
          WHEN p.price < 100 THEN '£50-£100'
          WHEN p.price < 200 THEN '£100-£200'
          ELSE 'Over £200'
        END as priceRange,
        COUNT(r.id) as reviewCount
      FROM reviews r
      INNER JOIN products p ON r.productId = p.id
      GROUP BY 
        CASE 
          WHEN p.price < 20 THEN 'Under £20'
          WHEN p.price < 50 THEN '£20-£50'
          WHEN p.price < 100 THEN '£50-£100'
          WHEN p.price < 200 THEN '£100-£200'
          ELSE 'Over £200'
        END
    `,
      { type: QueryTypes.SELECT }
    );

    // Convert to the expected format
    const priceRanges: { [key: string]: number } = {
      "Under £20": 0,
      "£20-£50": 0,
      "£50-£100": 0,
      "£100-£200": 0,
      "Over £200": 0,
    };

    (priceRangeQuery as any[]).forEach((item: any) => {
      if (item.priceRange && typeof item.priceRange === "string") {
        priceRanges[item.priceRange] = parseInt(item.reviewCount);
      }
    });

    const mostReviewedPriceRange = Object.entries(priceRanges).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    // Products needing attention (rating < 3)
    const productsNeedingAttention = await Review.findAll({
      attributes: [
        "productId",
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("Review.id")), "reviewCount"],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name", "category"],
        },
      ],
      group: ["productId"],
      having: sequelize.where(sequelize.fn("AVG", sequelize.col("rating")), {
        [Op.lt]: 3,
      }),
      order: [[sequelize.fn("AVG", sequelize.col("rating")), "ASC"]],
    });

    // Recent reviews
    const recentReviews = await Review.findAll({
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name", "category"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    res.status(200).json({
      storeInsights: {
        totalReviews,
        avgRating: Math.round(avgRating * 100) / 100, // Round to 2 decimal places
        bestCategory,
        mostReviewedPriceRange,
      },
      categoryRatings,
      ratingDistribution: ratingDistribution.reduce((acc: any, item: any) => {
        acc[
          `${item.get("rating")} Star${item.get("rating") !== 1 ? "s" : ""}`
        ] = parseInt(item.get("count"));
        return acc;
      }, {}),
      priceRangeDistribution: priceRanges,
      productsNeedingAttention,
      recentReviews,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ error: "Failed to get analytics" });
  }
};

// Get single review by ID
export const getReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "category", "price"],
        },
      ],
    });

    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    res.status(200).json({ review });
  } catch (error) {
    console.error("Get review error:", error);
    res.status(500).json({ error: "Failed to get review" });
  }
};
