const authService = require('../services/authService');

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
    const token = await authService.login(req.body);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.refreshTokens = async (req, res, next) => {
  try {
    const tokens = await authService.refreshTokens(req.body);
    res.status(200).json({ tokens });
  } catch (error) {
    next(error);
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