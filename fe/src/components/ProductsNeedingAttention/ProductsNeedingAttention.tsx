import React from "react";
import { Card } from "../Card";
import { AnalyticsResponse } from "../../types/api";
import styles from "./ProductsNeedingAttention.module.scss";

interface ProductsNeedingAttentionProps {
  analytics: AnalyticsResponse | null;
  loading?: boolean;
  error?: string | null;
}

const AlertIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

const StarIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const ProductsNeedingAttention = ({
  analytics,
  loading = false,
  error,
}: ProductsNeedingAttentionProps) => {
  const productsNeedingAttention = analytics?.productsNeedingAttention || [];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className={styles.stars}>
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  if (loading) {
    return (
      <Card
        title="Products Needing Attention"
        subtitle="Products with ratings below 3 stars"
        icon={<AlertIcon />}
        loading={true}
      />
    );
  }

  if (error) {
    return (
      <Card
        title="Products Needing Attention"
        subtitle="Products with ratings below 3 stars"
        icon={<AlertIcon />}
      >
        <div className={styles.errorState}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Products Needing Attention"
      subtitle="Products with ratings below 3 stars"
      icon={<AlertIcon />}
    >
      <div className={styles.content}>
        {productsNeedingAttention.length === 0 ? (
          <div className={styles.noIssues}>
            <div className={styles.successIcon}>✅</div>
            <p className={styles.successMessage}>
              Great! No products currently need attention.
            </p>
            <p className={styles.successSubtext}>
              All products have ratings of 3 stars or higher.
            </p>
          </div>
        ) : (
          <div className={styles.productsList}>
            {productsNeedingAttention.map((item: any, index: number) => (
              <div key={index} className={styles.productItem}>
                <div className={styles.productHeader}>
                  <h4 className={styles.productName}>
                    {item.product?.name || "Unknown Product"}
                  </h4>
                  <span className={styles.categoryBadge}>
                    {item.product?.category || "Unknown"}
                  </span>
                </div>

                <div className={styles.productStats}>
                  <div className={styles.rating}>
                    <div className={styles.ratingDisplay}>
                      {renderStars(parseFloat(item.avgRating))}
                      <span className={styles.ratingNumber}>
                        {parseFloat(item.avgRating).toFixed(1)}
                      </span>
                    </div>
                    <span className={styles.reviewCount}>
                      {item.reviewCount} review
                      {item.reviewCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className={styles.urgency}>
                    {parseFloat(item.avgRating) < 2 && (
                      <span className={styles.urgencyHigh}>High Priority</span>
                    )}
                    {parseFloat(item.avgRating) >= 2 &&
                      parseFloat(item.avgRating) < 2.5 && (
                        <span className={styles.urgencyMedium}>
                          Medium Priority
                        </span>
                      )}
                    {parseFloat(item.avgRating) >= 2.5 && (
                      <span className={styles.urgencyLow}>Low Priority</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
