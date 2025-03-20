const authService = require('../services/authService');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const responseData = await authService.login(req.body);

    if (responseData) {
      res.status(200).json({ success: true, message: 'Login successful', responseData });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  // No session to destroy, just send a success response
  res.status(200).json({ success: true, message: 'Logout successful' });
};

exports.refreshTokens = async (req, res) => {
  try {
      //console.log('📥 Refresh token request received:', req.body.refreshToken);
      const { refreshToken } = req.body;
      const tokens = await authService.refreshTokens(refreshToken);
      res.status(200).json(tokens);
  } catch (error) {
      //console.error('❌ Refresh token failed:', error.message);
      res.status(401).json({ error: 'Unauthorized' });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body);
    res.status(200).json({ message: 'Reset password email sent' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

exports.sendVerificationEmail = async (req, res, next) => {
  try {
    await authService.sendVerificationEmail(req.body);
    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.body);
    res.status(200).json({ message: 'Email verified' });
  } catch (error) {
    next(error);
  }
};