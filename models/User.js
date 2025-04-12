const { ObjectId } = require("mongodb");
const { getDB } = require("../db");
const bcrypt = require("bcryptjs");

class User {
  // Collection name
  static collectionName = "users";

  /**
   * Get the users collection
   * @returns {Collection} MongoDB collection
   */
  static getCollection() {
    return getDB().collection(this.collectionName);
  }

  /**
   * Find all users
   * @returns {Promise<Array>} Array of users (without passwords)
   */
  static async findAll() {
    const users = await this.getCollection().find().toArray();
    return users.map((user) => this.sanitizeUser(user));
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User document or null (without password)
   */
  static async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }
    const user = await this.getCollection().findOne({ _id: new ObjectId(id) });
    return user ? this.sanitizeUser(user) : null;
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User document or null (with password for verification)
   */
  static async findByEmail(email) {
    return await this.getCollection().findOne({ email: email.toLowerCase() });
  }

  /**
   * Find user by GitHub ID
   * @param {string} githubId - GitHub ID
   * @returns {Promise<Object|null>} User document or null (without password)
   */
  static async findByGithubId(githubId) {
    const user = await this.getCollection().findOne({ githubId: githubId });
    return user ? this.sanitizeUser(user) : null;
  }

  /**
   * Create a new user with email/password
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user (without password)
   */
  static async create(userData) {
    // Remove any client-provided _id, createdAt, or updatedAt fields
    const { _id, createdAt, updatedAt, password, ...cleanedData } = userData;

    // Validate email is not already in use
    const existingUser = await this.findByEmail(cleanedData.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const validatedData = {
      ...cleanedData,
      email: cleanedData.email.toLowerCase(),
      password: hashedPassword,
      roles: cleanedData.roles || ["user"],
      createdAt: new Date().toISOString(),
    };

    const result = await this.getCollection().insertOne(validatedData);
    const newUser = { _id: result.insertedId, ...validatedData };
    return this.sanitizeUser(newUser);
  }

  /**
   * Create or update a user via GitHub OAuth
   * @param {Object} githubProfile - GitHub profile data
   * @returns {Promise<Object>} User document (without password)
   */
  static async findOrCreateFromGithub(githubProfile) {
    // Check if user already exists
    let user = await this.getCollection().findOne({
      githubId: githubProfile.id,
    });

    if (user) {
      // Update existing user with latest GitHub data
      const updateData = {
        name: githubProfile.displayName || githubProfile.username,
        avatar: githubProfile.photos?.[0]?.value,
        updatedAt: new Date().toISOString(),
      };

      await this.getCollection().updateOne(
        { githubId: githubProfile.id },
        { $set: updateData }
      );

      return this.findByGithubId(githubProfile.id);
    } else {
      // Create new user from GitHub data
      const newUser = {
        githubId: githubProfile.id,
        name: githubProfile.displayName || githubProfile.username,
        email:
          githubProfile.emails?.[0]?.value ||
          `${githubProfile.username}@github.com`,
        avatar: githubProfile.photos?.[0]?.value,
        roles: ["user"],
        createdAt: new Date().toISOString(),
      };

      const result = await this.getCollection().insertOne(newUser);
      return this.sanitizeUser({ _id: result.insertedId, ...newUser });
    }
  }

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Updated user (without password)
   */
  static async update(id, userData) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    // Remove sensitive and immutable fields from update
    const {
      _id,
      createdAt,
      updatedAt,
      password,
      githubId,
      roles,
      ...cleanedData
    } = userData;

    const validatedData = {
      ...cleanedData,
      updatedAt: new Date().toISOString(),
    };

    // If updating email, ensure it's unique and lowercase
    if (validatedData.email) {
      validatedData.email = validatedData.email.toLowerCase();
      const existingUser = await this.findByEmail(validatedData.email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new Error("Email already in use");
      }
    }

    const result = await this.getCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: validatedData }
    );

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }

    return this.findById(id);
  }

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  static async delete(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const result = await this.getCollection().deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new Error("User not found");
    }

    return true;
  }

  /**
   * Verify user password
   * @param {string} email - User email
   * @param {string} password - Password to verify
   * @returns {Promise<Object|null>} User document if password is valid, null otherwise (without password)
   */
  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? this.sanitizeUser(user) : null;
  }

  /**
   * Remove sensitive fields from user object
   * @param {Object} user - User document
   * @returns {Object} Sanitized user (without password)
   */
  static sanitizeUser(user) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * Validate user data against schema
   * @param {Object} data - User data
   * @returns {Array<Object>} Validation errors, empty if valid
   */
  static validate(data) {
    const errors = [];

    // Required fields for regular registration
    if (!data.githubId) {
      const requiredFields = ["name", "email"];
      requiredFields.forEach((field) => {
        if (!data[field]) {
          errors.push({
            field,
            message: `${field} is required`,
          });
        }
      });

      // Password is required only for regular registration (not OAuth)
      if (!data.password && !data._id) {
        errors.push({
          field: "password",
          message: "Password is required",
        });
      }
    }

    // String validations
    if (data.name && (typeof data.name !== "string" || data.name.length < 2)) {
      errors.push({
        field: "name",
        message: "Name must be a string with at least 2 characters",
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

    // Password validation for new users or password changes
    if (data.password) {
      if (typeof data.password !== "string" || data.password.length < 8) {
        errors.push({
          field: "password",
          message: "Password must be at least 8 characters",
        });
      }
    }

    return errors;
  }
}

module.exports = User;
