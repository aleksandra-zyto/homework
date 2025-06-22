import React, { useState, useEffect } from "react";
import { Modal } from "../Modal/Modal";
import { TextField } from "../TextField";
import { Button } from "../Button";
import { ApiService } from "../../services/apiService";
import { Product } from "../../types/api";
import styles from "./AddReviewModal.module.scss";

export interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export const AddReviewModal = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: AddReviewModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    rating: "",
    comment: "",
  });
  const [errors, setErrors] = useState<{
    productId?: string;
    rating?: string;
    comment?: string;
  }>({});

  // Load products when modal opens
  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await ApiService.getProducts();
      setProducts(response.products);
    } catch (error) {
      console.error("Failed to load products:", error);
      onError?.("Failed to load products. Please try again.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.productId) {
      newErrors.productId = "Please select a product";
    }

    if (!formData.rating) {
      newErrors.rating = "Please select a rating";
    } else {
      const rating = parseInt(formData.rating);
      if (rating < 1 || rating > 5) {
        newErrors.rating = "Rating must be between 1 and 5";
      }
    }

    if (formData.comment && formData.comment.length > 500) {
      newErrors.comment = "Comment cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const reviewData = {
        productId: parseInt(formData.productId),
        rating: parseInt(formData.rating),
        comment: formData.comment.trim() || undefined,
      };

      const response = await ApiService.createReview(reviewData);

      onSuccess?.(response.message || "Review added successfully!");
      handleClose();
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to add review. Please try again.";
      onError?.(errorMessage);
      setErrors({ rating: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ productId: "", rating: "", comment: "" });
      setErrors({});
      onClose();
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating: rating.toString() }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  const selectedProduct = products.find(
    (p) => p.id.toString() === formData.productId
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Product Review"
      size="medium"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Product Selection */}
        <div className={styles.field}>
          <label htmlFor="product" className={styles.label}>
            Product <span className={styles.required}>*</span>
          </label>
          {loadingProducts ? (
            <div className={styles.loading}>Loading products...</div>
          ) : (
            <select
              id="product"
              value={formData.productId}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, productId: e.target.value }));
                if (errors.productId) {
                  setErrors((prev) => ({ ...prev, productId: undefined }));
                }
              }}
              className={`${styles.select} ${
                errors.productId ? styles.error : ""
              }`}
              disabled={loading}
              required
            >
              <option value="">Select a product to review</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.formattedPrice} ({product.category})
                </option>
              ))}
            </select>
          )}
          {errors.productId && (
            <span className={styles.errorText}>{errors.productId}</span>
          )}
        </div>

        {/* Product Details */}
        {selectedProduct && (
          <div className={styles.productDetails}>
            <div className={styles.productInfo}>
              <strong>{selectedProduct.name}</strong>
              <span className={styles.category}>
                {selectedProduct.category}
              </span>
              <span className={styles.price}>
                {selectedProduct.formattedPrice}
              </span>
            </div>
          </div>
        )}

        {/* Rating Selection */}
        <div className={styles.field}>
          <label className={styles.label}>
            Rating <span className={styles.required}>*</span>
          </label>
          <div className={styles.ratingContainer}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.star} ${
                    parseInt(formData.rating) >= star ? styles.active : ""
                  }`}
                  onClick={() => handleRatingClick(star)}
                  disabled={loading}
                  aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
            {formData.rating && (
              <span className={styles.ratingText}>
                {formData.rating} star{formData.rating !== "1" ? "s" : ""}
              </span>
            )}
          </div>
          {errors.rating && (
            <span className={styles.errorText}>{errors.rating}</span>
          )}
        </div>

        {/* Comment */}
        <div className={styles.field}>
          <TextField
            label="Comment (Optional)"
            value={formData.comment}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, comment: e.target.value }));
              if (errors.comment) {
                setErrors((prev) => ({ ...prev, comment: undefined }));
              }
            }}
            placeholder="Share your thoughts about this product..."
            disabled={loading}
            error={!!errors.comment}
            errorText={errors.comment}
            fullWidth
            maxLength={500}
          />
          <div className={styles.charCount}>
            {formData.comment.length}/500 characters
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.actions}>
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading || loadingProducts}
          >
            {loading ? "Adding Review..." : "Add Review"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
