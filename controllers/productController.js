const Product = require("../models/Product");
const { validationResult } = require("express-validator");

/**
 * Get all products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};

/**
 * Get product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    if (err.message === "Invalid product ID") {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
};

/**
 * Get products by supplier ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProductsBySupplier = async (req, res) => {
  try {
    const products = await Product.findBySupplier(req.params.supplierId);
    res.json(products);
  } catch (err) {
    if (err.message === "Invalid supplier ID") {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error fetching products by supplier:", err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};

/**
 * Create a new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createProduct = async (req, res) => {
  // Check express-validator validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Perform custom validations from the model
  const modelValidationErrors = Product.validate(req.body);
  if (modelValidationErrors.length > 0) {
    return res.status(400).json({ errors: modelValidationErrors });
  }

  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

/**
 * Update a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProduct = async (req, res) => {
  // Check express-validator validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Perform custom validations from the model
  const modelValidationErrors = Product.validate(req.body);
  if (modelValidationErrors.length > 0) {
    return res.status(400).json({ errors: modelValidationErrors });
  }

  try {
    const updatedProduct = await Product.update(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (err) {
    if (err.message === "Invalid product ID") {
      return res.status(400).json({ error: err.message });
    }
    if (err.message === "Product not found") {
      return res.status(404).json({ error: err.message });
    }
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

/**
 * Delete a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteProduct = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    if (err.message === "Invalid product ID") {
      return res.status(400).json({ error: err.message });
    }
    if (err.message === "Product not found") {
      return res.status(404).json({ error: err.message });
    }
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
