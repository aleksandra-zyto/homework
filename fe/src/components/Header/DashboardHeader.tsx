import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./DashboardHeader.module.scss";
import { Button } from "../Button/Button";

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

interface DashboardHeaderProps {
  onRefresh: () => void;
}

const DashboardHeader = ({ onRefresh }: DashboardHeaderProps) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getUserName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.email?.split("@")[0] || "User";
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to Analytics, {getUserName()}</h1>
        <div className={styles.actions}>
          <Button
            onClick={onRefresh}
            type="button"
            variant="outlined"
            size="small"
          >
            Refresh
          </Button>
          <Button
            onClick={handleLogout}
            type="button"
            size="small"
            variant="primary"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
