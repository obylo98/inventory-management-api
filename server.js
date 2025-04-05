const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const productsRouter = require("./routes/products");
const suppliersRouter = require("./routes/suppliers");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
require("dotenv").config();

const app = express();

// Enhanced CORS configuration for production
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            process.env.CLIENT_URL || "https://render.com",
            // Add any additional domains that need access
            "https://render.com",
          ]
        : "*", // In development, allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/suppliers", suppliersRouter);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Inventory Management API",
    documentation: `/api-docs`,
    endpoints: {
      products: "/api/products",
      suppliers: "/api/suppliers",
    },
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Connect to DB and start server
connectDB()
  .then(() => {
    // Render will use the PORT environment variable
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(
        `API Documentation available at ${
          process.env.NODE_ENV === "production"
            ? process.env.APP_URL || "https://your-render-app.onrender.com"
            : `http://localhost:${PORT}`
        }/api-docs`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

module.exports = app;
