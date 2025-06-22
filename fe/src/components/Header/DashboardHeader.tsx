import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./DashboardHeader.module.scss";
import { Button } from "../Button/Button";

const DashboardHeader = () => {
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
        <h1 className={styles.title}>Welcome to Analytics, {getUserName()}</h1>{" "}
        <Button
          onClick={handleLogout}
          type="button"
          size="small"
          variant="primary"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
