const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for authentication
 * @param {string} type - "token" (access) or "refresh" (refresh token)
 * @param {number} userId - User ID
 * @param {string} email - User email
 * @param {number} roleId - User role ID
 * @returns {string} JWT token
 */
function generateToken(type, id, email, role_id) {
    if (!id || !email || !role_id) {
        throw new Error("Missing required user data for token generation.");
    }
    
    const secret = type === 'token' ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;
    const expiresIn = type === 'token' ? '1h' : '7d'; // 1 hour for access, 7 days for refresh

    if (!secret) {
        throw new Error(`Missing JWT secret for ${type} token.`);
    }

    return jwt.sign({ id, email, role_id }, secret, { expiresIn });
}

module.exports = { generateToken };
