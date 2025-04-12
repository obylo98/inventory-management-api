const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const productsRouter = require("./routes/products");
const suppliersRouter = require("./routes/suppliers");
const authRouter = require("./routes/auth");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
// Import the swagger module but only import the swaggerDocument
const { swaggerDocument } = require("./swagger");
require("dotenv").config();

const app = express();

// Simple CORS configuration that allows all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// We'll no longer generate the swagger.json file during server startup
// to prevent nodemon's restart loop

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/auth", authRouter);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Inventory Management API",
    documentation: `/api-docs`,
    endpoints: {
      products: "/api/products",
      suppliers: "/api/suppliers",
      auth: "/api/auth",
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
            ? process.env.APP_URL ||
              "https://inventory-management-api-hi7k.onrender.com"
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
