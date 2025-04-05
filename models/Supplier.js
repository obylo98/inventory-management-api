const { ObjectId } = require("mongodb");
const { getDB } = require("../db");

class Supplier {
  // Collection name
  static collectionName = "suppliers";

  /**
   * Get the suppliers collection
   * @returns {Collection} MongoDB collection
   */
  static getCollection() {
    return getDB().collection(this.collectionName);
  }

  /**
   * Find all suppliers
   * @returns {Promise<Array>} Array of suppliers
   */
  static async findAll() {
    return await this.getCollection().find().toArray();
  }

  /**
   * Find supplier by ID
   * @param {string} id - Supplier ID
   * @returns {Promise<Object|null>} Supplier document or null
   */
  static async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid supplier ID");
    }
    return await this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  /**
   * Create a new supplier
   * @param {Object} supplierData - Supplier data
   * @returns {Promise<Object>} Created supplier
   */
  static async create(supplierData) {
    const validatedData = {
      ...supplierData,
      createdAt: new Date().toISOString(),
    };

    const result = await this.getCollection().insertOne(validatedData);
    return { _id: result.insertedId, ...validatedData };
  }

  /**
   * Update a supplier
   * @param {string} id - Supplier ID
   * @param {Object} supplierData - Supplier data
   * @returns {Promise<Object>} Updated supplier
   */
  static async update(id, supplierData) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid supplier ID");
    }

    const validatedData = {
      ...supplierData,
      updatedAt: new Date().toISOString(),
    };

    const result = await this.getCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: validatedData }
    );

    if (result.matchedCount === 0) {
      throw new Error("Supplier not found");
    }

    return { _id: id, ...validatedData };
  }

  /**
   * Delete a supplier
   * @param {string} id - Supplier ID
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  static async delete(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid supplier ID");
    }

    const result = await this.getCollection().deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new Error("Supplier not found");
    }

    return true;
  }

  /**
   * Validate supplier data against schema
   * @param {Object} data - Supplier data
   * @returns {Array<Object>} Validation errors, empty if valid
   */
  static validate(data) {
    const errors = [];

    // Required fields
    const requiredFields = [
      "name",
      "contactName",
      "email",
      "phone",
      "address",
      "country",
      "supplierType",
      "paymentTerms",
      "isActive",
    ];
    requiredFields.forEach((field) => {
      if (!data[field] && data[field] !== false) {
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

    if (data.contactName && typeof data.contactName !== "string") {
      errors.push({
        field: "contactName",
        message: "Contact name must be a string",
      });
    }

    if (data.country && typeof data.country !== "string") {
      errors.push({
        field: "country",
        message: "Country must be a string",
      });
    }

    if (data.paymentTerms && typeof data.paymentTerms !== "string") {
      errors.push({
        field: "paymentTerms",
        message: "Payment terms must be a string",
      });
    }

    // Email validation
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push({
          field: "email",
          message: "Email must be a valid email address",
        });
      }
    }

    // Phone validation
    if (data.phone && typeof data.phone !== "string") {
      errors.push({
        field: "phone",
        message: "Phone must be a string",
      });
    }

    // Enum validation
    if (
      data.supplierType &&
      !["manufacturer", "wholesaler", "distributor", "retailer"].includes(
        data.supplierType
      )
    ) {
      errors.push({
        field: "supplierType",
        message:
          "Supplier type must be one of: manufacturer, wholesaler, distributor, retailer",
      });
    }

    // Boolean validation
    if (data.isActive !== undefined && typeof data.isActive !== "boolean") {
      errors.push({
        field: "isActive",
        message: "isActive must be a boolean",
      });
    }

    // Address validation
    if (data.address) {
      if (typeof data.address !== "object") {
        errors.push({
          field: "address",
          message: "Address must be an object",
        });
      } else {
        const requiredAddressFields = ["street", "city", "state", "zipCode"];
        requiredAddressFields.forEach((field) => {
          if (!data.address[field]) {
            errors.push({
              field: `address.${field}`,
              message: `address.${field} is required`,
            });
          } else if (typeof data.address[field] !== "string") {
            errors.push({
              field: `address.${field}`,
              message: `address.${field} must be a string`,
            });
          }
        });
      }
    }

    return errors;
  }
}

module.exports = Supplier;
