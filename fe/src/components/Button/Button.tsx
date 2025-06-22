import React, { forwardRef } from "react";
import styles from "./Button.module.scss";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Design system props
  variant?: "primary" | "secondary" | "outlined" | "text" | "danger";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      disabled = false,
      loading = false,
      fullWidth = false,
      startIcon,
      endIcon,
      type = "button",
      onClick,
      onFocus,
      onBlur,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    // Build CSS classes
    const buttonClasses = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      disabled && styles["button--disabled"],
      loading && styles["button--loading"],
      fullWidth && styles["button--full-width"],
      (startIcon || endIcon || loading) && styles["button--with-icons"],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        className={buttonClasses}
        style={style}
        {...rest}
      >
        {/* Start Icon */}
        {startIcon && !loading && (
          <span className={`${styles.icon} ${styles["icon--start"]}`}>
            {startIcon}
          </span>
        )}

        {/* Loading Spinner */}
        {loading && (
          <span className={`${styles.icon} ${styles["icon--start"]}`}>
            <div className={styles.spinner} />
          </span>
        )}

        {/* Button Text */}
        <span className={styles.content}>{children}</span>

        {/* End Icon */}
        {endIcon && !loading && (
          <span className={`${styles.icon} ${styles["icon--end"]}`}>
            {endIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
