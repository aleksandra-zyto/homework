import React, { forwardRef } from "react";
import styles from "./TextField.module.scss";

export interface TextFieldProps {
  // Basic input props
  id?: string;
  name?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;

  // Label and help text
  label?: string;
  helperText?: string;
  errorText?: string;

  // Visual variants
  variant?: "outlined" | "filled" | "standard";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;

  // State variants
  error?: boolean;
  success?: boolean;
  loading?: boolean;

  // Icon support
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;

  // Event handlers
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  // Additional styling
  className?: string;
  style?: React.CSSProperties;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      name,
      type = "text",
      value,
      defaultValue,
      placeholder,
      disabled = false,
      readOnly = false,
      required = false,
      autoComplete,
      autoFocus = false,
      maxLength,
      minLength,
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
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      onKeyUp,
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
      readOnly && styles["textfield--readonly"],
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
            name={name}
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            className={styles.input}
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
