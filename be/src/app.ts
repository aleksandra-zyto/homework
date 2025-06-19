import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/database";

import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 5000;

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

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(
        "💾 SQLite database file: database.sqlite (will be created automatically)"
      );
    });
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
    process.exit(1);
  }
};

startServer();
