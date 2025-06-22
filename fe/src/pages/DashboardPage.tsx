import DashboardHeader from "../components/Header/DashboardHeader";
import { AnalyticsCards } from "../components/AnalyticsCards/AnalyticsCards";
import { VisualInsights } from "../components/VisualInsights/VisualInsights";
import { ReviewsTable } from "../components/ReviewsTable.tsx";
import styles from "./DashboardPage.module.scss";

export const DashboardPage = () => {
  return (
    <div className={styles.dashboardPage}>
      <DashboardHeader />
      <main className={styles.main}>
        <AnalyticsCards />
        <VisualInsights />
        <ReviewsTable />
      </main>
    </div>
  );
};
