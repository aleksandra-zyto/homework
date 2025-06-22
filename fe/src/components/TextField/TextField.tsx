import React, { forwardRef } from "react";
import styles from "./TextField.module.scss";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  // Design system props
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: "outlined" | "filled" | "standard";
  size?: "small" | "medium" | "large"; // Override the native size prop
  fullWidth?: boolean;

  // State variants
  error?: boolean;
  success?: boolean;
  loading?: boolean;

  // Icon support
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      errorText,
      variant = "outlined",
      size = "medium",
      fullWidth = false,
      error = false,
      success = false,
      loading = false,
      startIcon,
      endIcon,

      id,
      required = false,
      disabled = false,
      className = "",
      style,

      ...rest
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId =
      id || `textfield-${Math.random().toString(36).substr(2, 9)}`;

    // Build CSS classes using CSS Modules
    const wrapperClasses = [
      styles.textfield,
      styles[`textfield--${variant}`],
      styles[`textfield--${size}`],
      fullWidth && styles["textfield--full-width"],
      disabled && styles["textfield--disabled"],
      error && styles["textfield--error"],
      success && styles["textfield--success"],
      loading && styles["textfield--loading"],
      (startIcon || endIcon || loading) && styles["textfield--with-icons"],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Determine which helper text to show
    const displayHelperText = errorText || helperText;
    const helperTextType = errorText ? "error" : "helper";

    return (
      <div className={wrapperClasses} style={style}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className={styles.inputContainer}>
          {/* Start Icon */}
          {startIcon && (
            <div className={`${styles.icon} ${styles["icon--start"]}`}>
              {startIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled || loading}
            className={styles.input}
            aria-invalid={error}
            aria-describedby={
              displayHelperText ? `${inputId}-helper-text` : undefined
            }
            {...rest}
          />

          {/* End Icon or Loading Spinner */}
          {(endIcon || loading) && (
            <div className={`${styles.icon} ${styles["icon--end"]}`}>
              {loading ? <div className={styles.spinner} /> : endIcon}
            </div>
          )}
        </div>

        {/* Helper Text */}
        {displayHelperText && (
          <div
            id={`${inputId}-helper-text`}
            className={`${styles.helperText} ${
              styles[`helperText--${helperTextType}`]
            }`}
          >
            {displayHelperText}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
