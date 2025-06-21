import User from "./User";
import Product from "./Product";
import Review from "./Review";

// Define associations between models

Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Export all models
export { User, Product, Review };

export default {
  User,
  Product,
  Review,
};
