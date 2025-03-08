const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const crypto = require('crypto');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const sendEmail = require('../utils/sendEmail');

exports.register = async ({ email, password, role, created_by }) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const roleId = (await query('SELECT id FROM roles WHERE name = ?', [role]))[0].id;
  const user = {
    email,
    password: hashedPassword,
    role_id: roleId,
    created_by,
    created_on: new Date(),
    updated_by: created_by
  };
  await query('INSERT INTO users SET ?', user);
  return user;
};

exports.login = async ({ email, password }) => {
  const results = await query('SELECT * FROM users WHERE email = ?', [email]);
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

  const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return { token, refreshToken, user: { userId: user.id, email: user.email, role: user.role_id } };
};

exports.refreshTokens = async ({ refreshToken }) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const token = jwt.sign({ userId: decoded.userId, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return { token, refreshToken: newRefreshToken };
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};

exports.forgotPassword = async ({ email }) => {
  const results = await query('SELECT * FROM users WHERE email = ?', [email]);
  const user = results[0];

  if (!user) {
    throw new Error('Email not found');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE email = ?', [resetToken, resetPasswordExpire, email]);

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
    await query('UPDATE users SET resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE email = ?', [email]);
    throw new Error('Email could not be sent');
  }
};

exports.resetPassword = async ({ token, newPassword }) => {
  const results = await query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpire > ?', [token, Date.now()]);
  const user = results[0];

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await query('UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE id = ?', [hashedPassword, user.id]);
};

exports.sendVerificationEmail = async ({ email }) => {
  const results = await query('SELECT * FROM users WHERE email = ?', [email]);
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
    await query('UPDATE users SET isVerified = 1 WHERE id = ?', [decoded.userId]);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};