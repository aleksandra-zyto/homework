import React, { useEffect } from "react";
import styles from "./Modal.module.scss";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}: ModalProps) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const modalClasses = [styles.modal, styles[`modal--${size}`]]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={modalClasses}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {showCloseButton && (
            <button
              className={styles.closeButton}
              onClick={onClose}
              type="button"
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

const CloseIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
