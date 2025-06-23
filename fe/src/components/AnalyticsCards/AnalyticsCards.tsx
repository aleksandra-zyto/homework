import React, { useEffect, useState } from "react";
import { Card } from "../Card";
import { ApiService } from "../../services/apiService";
import { AnalyticsResponse } from "../../types/api";
import { Button } from "../Button";
import styles from "./AnalyticsCards.module.scss";

interface AnalyticsCardsProps {
  analytics?: AnalyticsResponse | null;
  loading?: boolean;
  error?: string | null;
}

const ChartBarIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const StarIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const TagIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const CurrencyIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>
);

export const AnalyticsCards = ({
  analytics,
  loading,
  error,
}: AnalyticsCardsProps) => {
  if (error) {
    return (
      <div className={styles.analyticsCards}>
        <div className={styles.errorState}>
          <h3 className={styles.errorTitle}>Failed to Load Analytics</h3>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.analyticsCards}>
      <div className={styles.sectionTitle}>
        <div className={styles.icon}>
          <ChartBarIcon />
        </div>
        <span>Store Insights</span>
      </div>

      <div
        className={`${styles.cardsGrid} ${loading ? styles.loadingState : ""}`}
      >
        <div className={styles.totalReviewsCard}>
          <Card
            title="Total Reviews"
            subtitle="All time reviews"
            value={analytics?.storeInsights.totalReviews || 0}
            label="reviews collected"
            icon={<ChartBarIcon />}
            loading={loading}
            size="medium"
          />
        </div>

        <div className={styles.avgRatingCard}>
          <Card
            title="Average Rating"
            subtitle="Overall satisfaction"
            size="medium"
            value={
              analytics?.storeInsights.avgRating
                ? `${analytics.storeInsights.avgRating.toFixed(1)}⭐`
                : "0.0⭐"
            }
            label="out of 5 stars"
            icon={<StarIcon />}
            loading={loading}
          />
        </div>

        <div className={styles.bestCategoryCard}>
          <Card
            title="Top Category"
            subtitle="Highest rated"
            value={analytics?.storeInsights.bestCategory || "N/A"}
            label="best performing category"
            icon={<TagIcon />}
            loading={loading}
            size="medium"
          />
        </div>

        <div className={styles.priceRangeCard}>
          <Card
            title="Popular Price Range"
            subtitle="Most reviewed"
            value={analytics?.storeInsights.mostReviewedPriceRange || "N/A"}
            label="price range with most reviews"
            icon={<CurrencyIcon />}
            loading={loading}
            size="medium"
          />
        </div>
      </div>
    </div>
  );
};
