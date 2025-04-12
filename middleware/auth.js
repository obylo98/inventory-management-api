const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * JWT Secret key - should be in environment variables in production
 */
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Generate JWT token for a user
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    roles: user.roles,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

/**
 * Verify JWT token from request
 * @param {String} token - JWT token
 * @returns {Object|null} Decoded token payload or null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from request
 * @param {Object} req - Express request object
 * @returns {String|null} JWT token or null
 */
const getTokenFromRequest = (req) => {
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Then check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
};

/**
 * Authentication middleware
 * Attaches user to request if authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from request
    const token = getTokenFromRequest(req);

    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      req.user = null;
      return next();
    }

    // Find user from token
    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

/**
 * Authorization middleware
 * Requires authentication to access route
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

/**
 * Role-based authorization middleware
 * Requires user to have specified role
 * @param {String|Array} roles - Required role(s)
 * @returns {Function} Middleware function
 */
const requireRole = (roles) => {
  const roleArray = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const hasRequiredRole = req.user.roles.some((role) =>
      roleArray.includes(role)
    );
    if (!hasRequiredRole) {
      return res.status(403).json({ error: "Permission denied" });
    }

    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  requireAuth,
  requireRole,
};
