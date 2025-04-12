const { ObjectId } = require("mongodb");
const { getDB } = require("../db");

class Product {
  // Collection name
  static collectionName = "products";

  /**
   * Get the products collection
   * @returns {Collection} MongoDB collection
   */
  static getCollection() {
    return getDB().collection(this.collectionName);
  }

  /**
   * Find all products
   * @returns {Promise<Array>} Array of products
   */
  static async findAll() {
    return await this.getCollection().find().toArray();
  }

  /**
   * Find product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>} Product document or null
   */
  static async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid product ID");
    }
    return await this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  /**
   * Find products by supplier ID
   * @param {string} supplierId - Supplier ID
   * @returns {Promise<Array>} Array of products
   */
  static async findBySupplier(supplierId) {
    if (!ObjectId.isValid(supplierId)) {
      throw new Error("Invalid supplier ID");
    }
    return await this.getCollection()
      .find({ supplierId: new ObjectId(supplierId) })
      .toArray();
  }

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  static async create(productData) {
    // Remove any client-provided _id, createdAt, or updatedAt fields
    const { _id, createdAt, updatedAt, ...cleanedData } = productData;

    const validatedData = {
      ...cleanedData,
      createdAt: new Date().toISOString(),
    };

    // Convert supplierId to ObjectId if present
    if (
      validatedData.supplierId &&
      ObjectId.isValid(validatedData.supplierId)
    ) {
      validatedData.supplierId = new ObjectId(validatedData.supplierId);
    }

    const result = await this.getCollection().insertOne(validatedData);
    return { _id: result.insertedId, ...validatedData };
  }

  /**
   * Update a product
   * @param {string} id - Product ID
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Updated product
   */
  static async update(id, productData) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid product ID");
    }

    // Remove any client-provided _id, createdAt, or updatedAt fields
    const { _id, createdAt, updatedAt, ...cleanedData } = productData;

    const validatedData = {
      ...cleanedData,
      updatedAt: new Date().toISOString(),
    };

    // Convert supplierId to ObjectId if present
    if (
      validatedData.supplierId &&
      ObjectId.isValid(validatedData.supplierId)
    ) {
      validatedData.supplierId = new ObjectId(validatedData.supplierId);
    }

    const result = await this.getCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: validatedData }
    );

    if (result.matchedCount === 0) {
      throw new Error("Product not found");
    }

    return { _id: id, ...validatedData };
  }

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  static async delete(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid product ID");
    }

    const result = await this.getCollection().deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new Error("Product not found");
    }

    return true;
  }

  /**
   * Validate product data against schema
   * @param {Object} data - Product data
   * @returns {Array<Object>} Validation errors, empty if valid
   */
  static validate(data) {
    const errors = [];

    // Required fields
    const requiredFields = [
      "name",
      "description",
      "price",
      "stock",
      "category",
      "isAvailable",
    ];
    requiredFields.forEach((field) => {
      if (!data[field] && data[field] !== 0 && data[field] !== false) {
        errors.push({
          field,
          message: `${field} is required`,
        });
      }
    });

    // String validations
    if (data.name && (typeof data.name !== "string" || data.name.length < 2)) {
      errors.push({
        field: "name",
        message: "Name must be a string with at least 2 characters",
      });
    }

    if (
      data.description &&
      (typeof data.description !== "string" || data.description.length < 10)
    ) {
      errors.push({
        field: "description",
        message: "Description must be a string with at least 10 characters",
      });
    }

    if (data.category && typeof data.category !== "string") {
      errors.push({
        field: "category",
        message: "Category must be a string",
      });
    }

    // Number validations
    if (
      data.price &&
      (isNaN(parseFloat(data.price)) || parseFloat(data.price) < 0)
    ) {
      errors.push({
        field: "price",
        message: "Price must be a positive number",
      });
    }

    if (
      data.discountPercentage &&
      (isNaN(parseFloat(data.discountPercentage)) ||
        parseFloat(data.discountPercentage) < 0)
    ) {
      errors.push({
        field: "discountPercentage",
        message: "Discount percentage must be a positive number",
      });
    }

    if (
      data.stock &&
      (!Number.isInteger(parseInt(data.stock)) || parseInt(data.stock) < 0)
    ) {
      errors.push({
        field: "stock",
        message: "Stock must be a non-negative integer",
      });
    }

    // Boolean validations
    if (
      data.isAvailable !== undefined &&
      typeof data.isAvailable !== "boolean"
    ) {
      errors.push({
        field: "isAvailable",
        message: "isAvailable must be a boolean",
      });
    }

    // Object validations
    if (data.dimensions && typeof data.dimensions !== "object") {
      errors.push({
        field: "dimensions",
        message: "Dimensions must be an object",
      });
    } else if (data.dimensions) {
      ["height", "width", "depth"].forEach((dimension) => {
        if (
          data.dimensions[dimension] &&
          isNaN(parseFloat(data.dimensions[dimension]))
        ) {
          errors.push({
            field: `dimensions.${dimension}`,
            message: `dimensions.${dimension} must be a number`,
          });
        }
      });

      if (data.dimensions.unit && typeof data.dimensions.unit !== "string") {
        errors.push({
          field: "dimensions.unit",
          message: "dimensions.unit must be a string",
        });
      }
    }

    // Array validations
    if (data.tags && !Array.isArray(data.tags)) {
      errors.push({
        field: "tags",
        message: "Tags must be an array",
      });
    }

    // ID validations
    if (data.supplierId && !ObjectId.isValid(data.supplierId)) {
      errors.push({
        field: "supplierId",
        message: "Invalid supplier ID format",
      });
    }

    return errors;
  }
}

module.exports = Product;
