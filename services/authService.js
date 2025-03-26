const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const db = require('../config/database');
const pool = require('../config/database'); // Use `pool` for async/await support
const crypto = require('crypto');
const util = require('util');
//const query = util.promisify(db.query).bind(db);
const sendEmail = require('../utils/sendEmail');
const { generateToken } = require('../utils/authHelper');

exports.register = async ({ email, password, role_id, created_by }) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  //const roleId = (await pool.query('SELECT id FROM roles WHERE name = ?', [role]))[0].id;
  const user = {
    email,
    password: hashedPassword,
    name,
    is_active,
    role_id,
    created_by,
    created_on: new Date(),
    updated_by: created_by
  };
  await pool.query('INSERT INTO users SET ?', user);
  return user;
};

exports.login = async ({ email, password }) => {
  //console.log('📥 Login request received:', email);

  try {
      // Fetch user from database
      const [rows] = await pool.query('SELECT id, email, password, role_id FROM users WHERE email = ?', [email]);

      if (!rows.length) {
          //console.warn('⚠️ Invalid login attempt for email:', email);
          throw new Error('Invalid credentials');
      }

      const user = rows[0];
      //console.log('✅ User found:', user.email);

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.warn('⚠️ Incorrect password attempt for:', email);
          throw new Error('Invalid credentials');
      }

      // Generate tokens
      const token = generateToken('token', user.id, user.email, user.role_id);
      const refreshToken = generateToken('refresh', user.id, user.email, user.role_id);

      //console.log('🔑 Tokens generated for:', user.email);

      return { 
          token, 
          refreshToken, 
          userInfo: { userId: user.id, email: user.email, role: user.role_id } 
      };
  } catch (error) {
      //console.error('❌ Error during login:', error.message);
      throw new Error('Authentication failed');
  }
};


exports.login = async ({ email, password }) => {
  const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (results.length === 0) {
    throw new Error('Invalid credentials');
  }
  const user = results[0];

  if (!user) {
    throw new Error('Invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken('token', user.id, user.email, user.role_id);
  const refreshToken = generateToken('refresh', user.id, user.email, user.role_id);

  return { token, refreshToken, userInfo: { userId: user.id, email: user.email, role: user.role_id } };
};

/**
 * Refreshes access and refresh tokens
 * @param {string} refreshToken - The refresh token from the client
 * @returns {Promise<{ token: string, refreshToken: string }>} - New tokens
 */
exports.refreshTokens = async (refreshToken) => {
  //console.log('🔄 Refreshing tokens');

  if (!refreshToken) {
      throw new Error('Refresh token is required');
  }

  try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      //console.log('✅ Refresh token verified for user:', decoded.email);

      // Ensure user still exists
      const [rows] = await pool.query('SELECT id, email, role_id FROM users WHERE id = ?', [decoded.id]);

      if (!rows.length) {
          console.warn('⚠️ User not found for refresh token:', decoded.email);
          throw new Error('Invalid refresh token');
      }

      const user = rows[0];

      // Generate new tokens
      const newToken = generateToken('token', user.id, user.email, user.role_id);
      const newRefreshToken = generateToken('refresh', user.id, user.email, user.role_id);

      //console.log('🔑 New tokens generated for:', user.email);

      return { token: newToken, refreshToken: newRefreshToken };
  } catch (error) {
      //console.error('❌ Error refreshing tokens:', error.message);
      throw new Error('Invalid or expired refresh token');
  }
};

exports.forgotPassword = async ({ email }) => {
  const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = results[0];

  if (!user) {
    throw new Error('Email not found');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await pool.query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE email = ?', [resetToken, resetPasswordExpire, email]);

  const resetUrl = `${process.env.FRONTEND_URL}/passwordreset/${resetToken}`;

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please make a PUT request to the following link:</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message
    });
  } catch (err) {
    await pool.query('UPDATE users SET resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE email = ?', [email]);
    throw new Error('Email could not be sent');
  }
};

exports.resetPassword = async ({ token, newPassword }) => {
  const [results] = await pool.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpire > ?', [token, Date.now()]);
  const user = results[0];

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await pool.query('UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE id = ?', [hashedPassword, user.id]);
};

exports.sendVerificationEmail = async ({ email }) => {
  const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = results[0];

  if (!user) {
    throw new Error('Email not found');
  }

  const verificationToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const verificationUrl = `${process.env.FRONTEND_URL}/verifyemail/${verificationToken}`;

  const message = `
    <h1>Verify your email</h1>
    <p>Please make a GET request to the following link:</p>
    <a href=${verificationUrl} clicktracking=off>${verificationUrl}</a>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      text: message
    });
  } catch (err) {
    throw new Error('Email could not be sent');
  }
};

exports.verifyEmail = async ({ token }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await pool.query('UPDATE users SET isVerified = 1 WHERE id = ?', [decoded.userId]);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};
