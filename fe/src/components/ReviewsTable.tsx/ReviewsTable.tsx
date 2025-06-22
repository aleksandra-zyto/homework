import React, { useState, useEffect } from "react";
import { Review, PaginationInfo } from "../../types/api";
import { ApiService } from "../../services/apiService";
import { Button } from "../Button";
import styles from "./ReviewsTable.module.scss";

interface ReviewsTableProps {
  className?: string;
}

const PRICE_RANGES = [
  "All Prices",
  "Under £20",
  "£20-£50",
  "£50-£100",
  "£100-£200",
  "Over £200",
];

export const ReviewsTable: React.FC<ReviewsTableProps> = ({
  className = "",
}) => {
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
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");

  const fetchReviews = async (
    page: number = 1,
    priceRange: string = "All Prices"
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params: any = {
        page,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "DESC",
      };

      // Add price range filter if not "All Prices"
      if (priceRange !== "All Prices") {
        // We'll need to filter by the price range on the backend
        // For now, we'll fetch all and filter client-side as a temporary solution
        const response = await ApiService.getReviews(params);

        let filteredReviews = response.reviews;

        if (priceRange !== "All Prices") {
          filteredReviews = response.reviews.filter((review) => {
            if (!review.product?.price) return false;

            const price = review.product.price;
            switch (priceRange) {
              case "Under £20":
                return price < 20;
              case "£20-£50":
                return price >= 20 && price < 50;
              case "£50-£100":
                return price >= 50 && price < 100;
              case "£100-£200":
                return price >= 100 && price < 200;
              case "Over £200":
                return price >= 200;
              default:
                return true;
            }
          });
        }

        setReviews(filteredReviews);

        // Update pagination for filtered results
        const totalFiltered = filteredReviews.length;
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(totalFiltered / 10),
          totalItems: totalFiltered,
          itemsPerPage: 10,
          hasNextPage: page < Math.ceil(totalFiltered / 10),
          hasPrevPage: page > 1,
        });
      } else {
        const response = await ApiService.getReviews(params);
        setReviews(response.reviews);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1, selectedPriceRange);
  }, [selectedPriceRange]);

  const handlePageChange = (newPage: number) => {
    fetchReviews(newPage, selectedPriceRange);
  };

  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRange(range);
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
            onClick={() => fetchReviews(1, selectedPriceRange)}
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
          <label htmlFor="priceRange">Filter by Price Range:</label>
          <select
            id="priceRange"
            value={selectedPriceRange}
            onChange={(e) => handlePriceRangeChange(e.target.value)}
            className={styles.select}
          >
            {PRICE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
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
                      No reviews found for the selected price range.
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
