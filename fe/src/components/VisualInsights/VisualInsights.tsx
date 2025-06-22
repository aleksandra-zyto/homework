import React, { useState, useEffect, useMemo } from "react";
import { Chart, ChartData } from "../Chart";
import { ApiService } from "../../services/apiService";
import { AnalyticsResponse } from "../../types/api";
import { Button } from "../Button";
import styles from "./VisualInsights.module.scss";

// Icons
const ChartIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const BarChartIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const PieChartIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

type ChartViewType = "category" | "rating" | "priceRange";
type ChartType = "bar" | "pie";

export const VisualInsights = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartView, setChartView] = useState<ChartViewType>("category");
  const [chartType, setChartType] = useState<ChartType>("bar");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || "Failed to load analytics data");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Transform analytics data for charts
  const chartData = useMemo((): ChartData[] => {
    if (!analytics) return [];

    switch (chartView) {
      case "category":
        return analytics.categoryRatings.map((item) => ({
          name: item.category,
          value: item.reviewCount,
          avgRating: item.avgRating,
        }));

      case "rating":
        // Create rating distribution from 1-5 stars
        const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => {
          // This is a simplified calculation - you might want to get actual rating distribution from your API
          const count = analytics.categoryRatings.reduce((total, category) => {
            // Estimate distribution based on average rating
            if (
              category.avgRating >= rating - 0.5 &&
              category.avgRating < rating + 0.5
            ) {
              return total + category.reviewCount;
            }
            return total;
          }, 0);

          return {
            name: `${rating} Star${rating !== 1 ? "s" : ""}`,
            value: count,
          };
        });
        return ratingDistribution.filter((item) => item.value > 0);

      case "priceRange":
        return Object.entries(analytics.priceRangeDistribution || {}).map(
          ([range, count]) => ({
            name: range,
            value: count,
          })
        );

      default:
        return [];
    }
  }, [analytics, chartView]);

  const getChartTitle = () => {
    switch (chartView) {
      case "category":
        return "Reviews by Category";
      case "rating":
        return "Rating Distribution";
      case "priceRange":
        return "Price Range Performance";
      default:
        return "Review Distribution";
    }
  };

  const getChartSubtitle = () => {
    switch (chartView) {
      case "category":
        return "Number of reviews per product category";
      case "rating":
        return "Distribution of star ratings";
      case "priceRange":
        return "Reviews across different price ranges";
      default:
        return "";
    }
  };

  // Secondary chart - always show price range distribution as pie chart
  const secondaryChartData = useMemo((): ChartData[] => {
    if (!analytics?.priceRangeDistribution) return [];

    return Object.entries(analytics.priceRangeDistribution).map(
      ([range, count]) => ({
        name: range,
        value: count,
      })
    );
  }, [analytics]);

  return (
    <div className={styles.visualInsights}>
      <div className={styles.sectionTitle}>
        <div className={styles.icon}>
          <ChartIcon />
        </div>
        <span>Visual Insights</span>
        <Button
          onClick={fetchAnalytics}
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Main Chart */}
      <Chart
        title={getChartTitle()}
        subtitle={getChartSubtitle()}
        type={chartType}
        data={chartData}
        loading={loading}
        height={350}
      >
        <div className={styles.chartControls}>
          <div className={styles.viewSelector}>
            <select
              value={chartView}
              onChange={(e) => setChartView(e.target.value as ChartViewType)}
              disabled={loading}
            >
              <option value="category">By Category</option>
              <option value="rating">By Rating</option>
              <option value="priceRange">By Price Range</option>
            </select>
          </div>

          <div className={styles.chartTypeSelector}>
            <button
              className={`${styles.chartTypeButton} ${
                chartType === "bar" ? styles.active : ""
              }`}
              onClick={() => setChartType("bar")}
              disabled={loading}
            >
              <BarChartIcon />
              Bar
            </button>
            <button
              className={`${styles.chartTypeButton} ${
                chartType === "pie" ? styles.active : ""
              }`}
              onClick={() => setChartType("pie")}
              disabled={loading}
            >
              <PieChartIcon />
              Pie
            </button>
          </div>
        </div>
      </Chart>
    </div>
  );
};
