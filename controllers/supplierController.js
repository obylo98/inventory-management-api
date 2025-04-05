const Supplier = require("../models/Supplier");
const { validationResult } = require("express-validator");

/**
 * Get all suppliers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Failed to retrieve suppliers" });
  }
};

/**
 * Get supplier by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json(supplier);
  } catch (err) {
    if (err.message === "Invalid supplier ID") {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error fetching supplier:", err);
    res.status(500).json({ error: "Failed to retrieve supplier" });
  }
};

/**
 * Create a new supplier
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createSupplier = async (req, res) => {
  // Check express-validator validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Perform custom validations from the model
  const modelValidationErrors = Supplier.validate(req.body);
  if (modelValidationErrors.length > 0) {
    return res.status(400).json({ errors: modelValidationErrors });
  }

  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    console.error("Error creating supplier:", err);
    res.status(500).json({ error: "Failed to create supplier" });
  }
};

/**
 * Update a supplier
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateSupplier = async (req, res) => {
  // Check express-validator validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Perform custom validations from the model
  const modelValidationErrors = Supplier.validate(req.body);
  if (modelValidationErrors.length > 0) {
    return res.status(400).json({ errors: modelValidationErrors });
  }

  try {
    const updatedSupplier = await Supplier.update(req.params.id, req.body);
    res.json(updatedSupplier);
  } catch (err) {
    if (err.message === "Invalid supplier ID") {
      return res.status(400).json({ error: err.message });
    }
    if (err.message === "Supplier not found") {
      return res.status(404).json({ error: err.message });
    }
    console.error("Error updating supplier:", err);
    res.status(500).json({ error: "Failed to update supplier" });
  }
};

/**
 * Delete a supplier
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.delete(req.params.id);
    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    if (err.message === "Invalid supplier ID") {
      return res.status(400).json({ error: err.message });
    }
    if (err.message === "Supplier not found") {
      return res.status(404).json({ error: err.message });
    }
    console.error("Error deleting supplier:", err);
    res.status(500).json({ error: "Failed to delete supplier" });
  }
};
