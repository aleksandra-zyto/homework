import React from "react";
import styles from "./Card.module.scss";

export interface CardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  label?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: "positive" | "negative" | "neutral";
    icon?: React.ReactNode;
  };
  size?: "small" | "medium" | "large";
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({
  title,
  subtitle,
  value,
  label,
  icon,
  trend,
  size = "medium",
  loading = false,
  children,
  className = "",
  onClick,
}: CardProps) => {
  const cardClasses = [
    styles.card,
    styles[`card--${size}`],
    loading && styles["card--loading"],
    onClick && "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>

      <div className={styles.content}>
        {children ? (
          children
        ) : (
          <>
            {value !== undefined && (
              <>
                <p className={styles.value}>
                  {loading ? <span className={styles.loadingSpinner} /> : value}
                </p>
                {label && <p className={styles.label}>{label}</p>}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
