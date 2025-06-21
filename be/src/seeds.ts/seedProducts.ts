import sequelize from "../config/database";
import Product, { Category } from "../models/Product";

// Properly type the seed data to match our Product model
const seedProducts: Array<{
  name: string;
  category: Category;
  price: number;
}> = [
  // Electronics
  { name: "iPhone 14 Pro", category: "Electronics", price: 999.99 },
  { name: "Samsung Galaxy Buds", category: "Electronics", price: 149.99 },
  { name: "Bluetooth Speaker", category: "Electronics", price: 29.99 },

  // Clothing
  { name: "Nike Air Force 1", category: "Clothing", price: 89.99 },
  { name: "Levi's 501 Jeans", category: "Clothing", price: 69.99 },
  { name: "Basic T-Shirt", category: "Clothing", price: 12.99 },

  // Home & Garden
  { name: "Dyson V11 Vacuum", category: "Home & Garden", price: 399.99 },
  { name: "Coffee Machine", category: "Home & Garden", price: 179.99 },
  { name: "Plant Pot Set", category: "Home & Garden", price: 15.99 },

  // Sports
  { name: "Wilson Tennis Racket", category: "Sports", price: 129.99 },
  { name: "Football", category: "Sports", price: 24.99 },
  { name: "Yoga Mat", category: "Sports", price: 34.99 },

  // Beauty
  { name: "MAC Lipstick", category: "Beauty", price: 22.5 },
  { name: "Skincare Set", category: "Beauty", price: 79.99 },
  { name: "Face Mask", category: "Beauty", price: 8.99 },

  // Food & Drink
  { name: "Organic Honey", category: "Food & Drink", price: 16.5 },
  { name: "Premium Wine", category: "Food & Drink", price: 45.0 },
  { name: "Artisan Chocolate Box", category: "Food & Drink", price: 28.99 },
];

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if products already exist
    const existingProducts = await Product.count();
    if (existingProducts > 0) {
      console.log("📦 Products already exist, skipping seeding");
      return;
    }

    // Create all products
    await Product.bulkCreate(seedProducts);

    console.log(`✅ Successfully seeded ${seedProducts.length} products!`);
    console.log("📊 Products by category:");

    // Show summary
    const categories = [...new Set(seedProducts.map((p) => p.category))];
    for (const category of categories) {
      const count = seedProducts.filter((p) => p.category === category).length;
      const avgPrice =
        seedProducts
          .filter((p) => p.category === category)
          .reduce((sum, p) => sum + p.price, 0) / count;
      console.log(
        `   ${category}: ${count} products (avg: £${avgPrice.toFixed(2)})`
      );
    }

    console.log("💰 Price range distribution:");
    const ranges = {
      "Under £20": seedProducts.filter((p) => p.price < 20).length,
      "£20-£50": seedProducts.filter((p) => p.price >= 20 && p.price < 50)
        .length,
      "£50-£100": seedProducts.filter((p) => p.price >= 50 && p.price < 100)
        .length,
      "£100-£200": seedProducts.filter((p) => p.price >= 100 && p.price < 200)
        .length,
      "Over £200": seedProducts.filter((p) => p.price >= 200).length,
    };

    Object.entries(ranges).forEach(([range, count]) => {
      console.log(`   ${range}: ${count} products`);
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      await seedDatabase();
      process.exit(0);
    } catch (error) {
      console.error("Failed to seed database:", error);
      process.exit(1);
    }
  })();
}
