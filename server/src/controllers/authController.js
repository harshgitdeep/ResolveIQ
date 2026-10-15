import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { config } from '../config/index.js';

// Helper to sign JWT
const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );
};

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already registered
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existing.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Default to 'customer' if not provided or restricted
    const assignedRole = role === 'support_agent' || role === 'admin' ? role : 'customer';

    // Hash password with bcrypt salt rounds = 10
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const insertUserRes = await query(
      `INSERT INTO users (name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, name, email, role, is_active, created_at`,
      [name.trim(), normalizedEmail, passwordHash, assignedRole]
    );

    const newUser = insertUserRes.rows[0];

    // If customer role, also ensure a row in customers table linked to user_id
    if (assignedRole === 'customer') {
      try {
        await query(
          `INSERT INTO customers (user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
          [newUser.id]
        );
      } catch (custErr) {
        // Continue even if customers table insert has different constraints
        console.warn('Note: customer table link warning:', custErr.message);
      }
    }

    const token = signToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating account',
    });
  }
};

/**
 * Sign in user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query user by email
    const userRes = await query(
      `SELECT id, name, email, password_hash, role, is_active
       FROM users
       WHERE LOWER(email) = $1`,
      [normalizedEmail]
    );

    if (userRes.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = userRes.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Compare bcrypt password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while logging in',
    });
  }
};

/**
 * Request password reset (forgot password)
 * Generates and returns a signed short-lived reset token (expires in 1h)
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userRes = await query('SELECT id, email, name FROM users WHERE LOWER(email) = $1', [normalizedEmail]);

    // For security, always respond with generic confirmation so we don't leak account existence
    if (userRes.rowCount === 0) {
      return res.status(200).json({
        success: true,
        message: 'If that email address is registered, password reset instructions have been generated.',
      });
    }

    const user = userRes.rows[0];

    // Create a 1-hour reset token
    const resetToken = jwt.sign(
      { id: user.id, purpose: 'password_reset' },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // In a production email service you'd mail this link; for full testability we return it in response as well
    return res.status(200).json({
      success: true,
      message: 'Password reset instructions have been processed.',
      resetToken, // Available for instant client testing/use
    });
  } catch (error) {
    console.error('Error processing forgot-password:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
    });
  }
};

/**
 * Reset password using token
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired',
      });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid token purpose',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const updateRes = await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email',
      [passwordHash, decoded.id]
    );

    if (updateRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Error in reset-password:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password',
    });
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
