const passport = require("passport");
const { Strategy: GitHubStrategy } = require("passport-github2");
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const { validationResult } = require("express-validator");

// GitHub OAuth Configuration
const GITHUB_CLIENT_ID =
  process.env.GITHUB_CLIENT_ID || "your-github-client-id";
const GITHUB_CLIENT_SECRET =
  process.env.GITHUB_CLIENT_SECRET || "your-github-client-secret";
const GITHUB_CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL ||
  "http://localhost:3000/api/auth/github/callback";

// Initialize GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user from GitHub profile
        const user = await User.findOrCreateFromGithub(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Passport serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    // Check express-validator validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check model validation
    const modelErrors = User.validate(req.body);
    if (modelErrors.length > 0) {
      return res.status(400).json({ errors: modelErrors });
    }

    // Create user
    const user = await User.create(req.body);

    // Generate token
    const token = generateToken(user);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    if (error.message === "Email already in use") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error in register:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

/**
 * Login a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Verify credentials
    const user = await User.verifyPassword(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

/**
 * Logout a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.logout = (req, res) => {
  // Clear cookie
  res.clearCookie("token");

  res.status(200).json({ message: "Logout successful" });
};

/**
 * Get current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.status(200).json({ user: req.user });
};

/**
 * GitHub authentication success handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.githubSuccess = (req, res) => {
  const user = req.user;

  // Generate token
  const token = generateToken(user);

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // Redirect to frontend or send JSON response
  if (process.env.FRONTEND_URL) {
    res.redirect(`${process.env.FRONTEND_URL}/login/success?token=${token}`);
  } else {
    res.status(200).json({
      message: "GitHub authentication successful",
      user,
      token,
    });
  }
};

/**
 * GitHub authentication failure handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.githubFailure = (req, res) => {
  res.status(401).json({ error: "GitHub authentication failed" });
};
