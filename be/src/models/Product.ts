import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Define the valid categories
export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Beauty",
  "Food & Drink",
] as const;

// Define price ranges for UI/filtering (calculated dynamically)
export const PRICE_RANGES = [
  "Under £20",
  "£20-£50",
  "£50-£100",
  "£100-£200",
  "Over £200",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type PriceRange = (typeof PRICE_RANGES)[number];

// Helper function to get price range from actual price
export const getPriceRange = (price: number): PriceRange => {
  if (price < 20) return "Under £20";
  if (price < 50) return "£20-£50";
  if (price < 100) return "£50-£100";
  if (price < 200) return "£100-£200";
  return "Over £200";
};

// Define what our Product object looks like
interface ProductAttributes {
  id: number;
  name: string;
  category: Category;
  price: number; // Store actual price instead of range
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating products - id, createdAt, updatedAt are optional (auto-generated)
interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id" | "createdAt" | "updatedAt"> {}

// The Product model class
class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: number;
  declare name: string;
  declare category: Category;
  declare price: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Instance method to get price range
  public getPriceRange(): PriceRange {
    return getPriceRange(this.price);
  }

  // Instance method to get formatted price
  public getFormattedPrice(): string {
    return `£${this.price.toFixed(2)}`;
  }
}

// Define the database table structure
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100],
        notEmpty: true,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [CATEGORIES],
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Up to £99,999,999.99
      allowNull: false,
      validate: {
        min: 0.01, // At least 1 penny
        max: 99999.99,
      },
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);

export default Product;
