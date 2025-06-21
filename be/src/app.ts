import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/database";
import User from "./models/User";
import Product from "./models/Product";
import Review from "./models/Review";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import { seedDatabase } from "./seeds.ts/seedProducts";

import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const startServer = async () => {
  try {
    // Test database connection
    console.log("Testing database connection...");
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully!");

    // Sync models (create tables)
    console.log("Creating database tables...");
    await sequelize.sync({ force: false });
    console.log("✅ Database tables created successfully!");

    await seedDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(
        "💾 User table created with: id, email, firstName, lastName, password, isActive, createdAt, updatedAt"
      );
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
