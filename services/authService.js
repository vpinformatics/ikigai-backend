const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const crypto = require('crypto');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const sendEmail = require('../utils/sendEmail');

exports.register = async ({ username, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = { username, password: hashedPassword, role };
  await query('INSERT INTO users SET ?', user);
  return user;
};

exports.login = async ({ username, password }) => {
  const results = await query('SELECT * FROM users WHERE username = ?', [username]);
  const user = results[0];

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return { token, refreshToken };
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
  const resetPasswordExpire = Date.now() + 10 * 60 * 1000