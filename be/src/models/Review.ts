import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Category } from "./Product";

// Define what our Review object looks like
interface ReviewAttributes {
  id: number;
  productId: number;
  category: Category; // Copied from product for fast analytics
  rating: number; // 1-5 stars
  comment?: string; // Optional, max 300 characters
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating reviews - id, createdAt, updatedAt are optional (auto-generated)
interface ReviewCreationAttributes
  extends Optional<
    ReviewAttributes,
    "id" | "comment" | "createdAt" | "updatedAt"
  > {}

// The Review model class
class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  declare id: number;
  declare productId: number;
  declare category: Category;
  declare rating: number;
  declare comment?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Instance method to check if review needs attention (low rating)
  public needsAttention(): boolean {
    return this.rating < 3;
  }

  // Instance method to get comment preview
  public getCommentPreview(maxLength: number = 50): string {
    if (!this.comment) return "";
    return this.comment.length > maxLength
      ? this.comment.substring(0, maxLength) + "..."
      : this.comment;
  }
}

// Define the database table structure
Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
      },
    },
    comment: {
      type: DataTypes.STRING(300),
      allowNull: true,
      validate: {
        len: [0, 300],
      },
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    timestamps: true,
  }
);

export default Review;
