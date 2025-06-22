import React, { useState } from "react";
import DashboardHeader from "../components/Header/DashboardHeader";
import { AnalyticsCards } from "../components/AnalyticsCards/AnalyticsCards";
import { VisualInsights } from "../components/VisualInsights/VisualInsights";
import { ReviewsTable } from "../components/ReviewsTable.tsx";
import { AddReviewModal } from "../components/AddReviewModal";
import { Button } from "../components/Button";
import styles from "./DashboardPage.module.scss";

const PlusIcon = () => (
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
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

export const DashboardPage = () => {
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger refresh across all components
  const triggerRefresh = () => {
    console.log("Triggering refresh across all components...");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAddReviewSuccess = (message: string) => {
    setNotification({ type: "success", message });
    // Auto-hide notification after 5 seconds
    triggerRefresh();

    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddReviewError = (message: string) => {
    setNotification({ type: "error", message });
    // Auto-hide notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className={styles.dashboardPage}>
      <DashboardHeader onRefresh={triggerRefresh} />

      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <span>{notification.message}</span>
          <button
            onClick={closeNotification}
            className={styles.closeNotification}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      <Button
        onClick={() => setIsAddReviewModalOpen(true)}
        variant="primary"
        size="large"
        startIcon={<PlusIcon />}
        className={styles.floatingButton}
      >
        Add Review
      </Button>

      <main className={styles.main}>
        <AnalyticsCards refreshTrigger={refreshTrigger} />

        <VisualInsights refreshTrigger={refreshTrigger} />

        <ReviewsTable refreshTrigger={refreshTrigger} />
      </main>

      <AddReviewModal
        isOpen={isAddReviewModalOpen}
        onClose={() => setIsAddReviewModalOpen(false)}
        onSuccess={handleAddReviewSuccess}
        onError={handleAddReviewError}
      />
    </div>
  );
};
