import React, { useState, useEffect } from "react";
import { Review, PaginationInfo } from "../../types/api";
import { ApiService } from "../../services/apiService";
import { Button } from "../Button";
import styles from "./ReviewsTable.module.scss";

interface ReviewsTableProps {
  refreshTrigger?: number; // When this changes, component will refresh
  className?: string;
}

const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Beauty",
  "Food & Drink",
];

const RATING_FILTERS = [
  "All Ratings",
  "1-2", // Low ratings
  "3", // Average ratings
  "4-5", // High ratings
];

export const ReviewsTable = ({
  className = "",
  refreshTrigger = 0,
}: ReviewsTableProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRating, setSelectedRating] = useState("All Ratings");

  const fetchReviews = async (
    page: number = 1,
    category: string = "All Categories",
    rating: string = "All Ratings"
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters for backend filtering
      const params: any = {
        page,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "DESC",
      };

      // Add category filter if not "All Categories"
      if (category !== "All Categories") {
        params.category = category;
      }

      // Add rating filter if not "All Ratings"
      if (rating !== "All Ratings") {
        params.rating = rating;
      }

      console.log("Sending API request with params:", params);

      const response = await ApiService.getReviews(params);

      console.log("Received response:", {
        reviewCount: response.reviews.length,
        pagination: response.pagination,
      });

      setReviews(response.reviews);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1, selectedCategory, selectedRating);
  }, [selectedCategory, selectedRating]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log("ReviewsTable: Refresh triggered");
      fetchReviews(pagination.currentPage, selectedCategory, selectedRating);
    }
  }, [refreshTrigger]);

  const handlePageChange = (newPage: number) => {
    fetchReviews(newPage, selectedCategory, selectedRating);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Reset to page 1 when filtering changes
  };

  const handleRatingChange = (rating: string) => {
    setSelectedRating(rating);
    // Reset to page 1 when filtering changes
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getCommentPreview = (comment?: string, maxLength: number = 50) => {
    if (!comment) return "No comment";
    return comment.length > maxLength
      ? comment.substring(0, maxLength) + "..."
      : comment;
  };

  if (error) {
    return (
      <div className={`${styles.reviewsTable} ${className}`}>
        <div className={styles.error}>
          <p>Error loading reviews: {error}</p>
          <Button
            onClick={() => fetchReviews(1, selectedCategory, selectedRating)}
            size="small"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.reviewsTable} ${className}`}>
      <div className={styles.header}>
        <h3>Recent Reviews</h3>
        <div className={styles.filters}>
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={styles.select}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label htmlFor="ratingFilter">Filter by Rating:</label>
          <select
            id="ratingFilter"
            value={selectedRating}
            onChange={(e) => handleRatingChange(e.target.value)}
            className={styles.select}
          >
            {RATING_FILTERS.map((rating) => (
              <option key={rating} value={rating}>
                {rating === "All Ratings" ? "All Ratings" : `${rating} Stars`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <p>Loading reviews...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.noData}>
                      No reviews found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id}>
                      <td className={styles.productName}>
                        {review.product?.name || "Unknown Product"}
                      </td>
                      <td className={styles.category}>
                        <span className={styles.categoryBadge}>
                          {review.category}
                        </span>
                      </td>
                      <td className={styles.price}>
                        £{review.product?.price?.toFixed(2) || "0.00"}
                      </td>
                      <td className={styles.rating}>
                        <span className={styles.stars}>
                          {renderStars(review.rating)}
                        </span>
                        <span className={styles.ratingNumber}>
                          ({review.rating}/5)
                        </span>
                      </td>
                      <td className={styles.comment}>
                        {getCommentPreview(review.comment)}
                      </td>
                      <td className={styles.date}>
                        {formatDate(review.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Showing{" "}
                {Math.min(
                  (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
                  pagination.totalItems
                )}{" "}
                -{" "}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems} reviews
              </div>

              <div className={styles.paginationControls}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  Previous
                </Button>

                <span className={styles.pageInfo}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <Button
                  variant="outlined"
                  size="small"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
