import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dataRoutes from "./routes/dataRoutes.js";
import strategyRoutes from "./routes/strategyRoutes.js";
import backtestRoutes from "./routes/backtestRoutes.js";
import papertradeRoutes from "./routes/papertradeRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import prisma from "./config/prisma.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test database connection
(async () => {
  try {
    await prisma.$connect();
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
})();

// Routes
app.use("/data", dataRoutes);
app.use("/strategy", strategyRoutes);
app.use("/backtest", backtestRoutes);
app.use("/papertrade", papertradeRoutes);
app.use("/portfolio", portfolioRoutes);

// global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
