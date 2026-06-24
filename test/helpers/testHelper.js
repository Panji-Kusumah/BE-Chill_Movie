const jwt = require('jsonwebtoken');

/**
 * Generate test JWT token
 * @param {Object} payload - Token payload
 * @param {string} secret - JWT secret (defaults to JWT_SECRET env var)
 * @returns {string} - JWT token
 */
function generateTestToken(payload = {}, secret = process.env.JWT_SECRET) {
    const defaultPayload = {
        userId: 1,
        email: 'test@example.com',
        username: 'testuser',
        ...payload
    };

    return jwt.sign(defaultPayload, secret, { expiresIn: '24h' });
}

/**
 * Get authorization header with bearer token
 * @param {string} token - JWT token
 * @returns {string} - Authorization header value
 */
function getAuthHeader(token) {
    return `Bearer ${token}`;
}

/**
 * Create authenticated request with token
 * @param {Object} requestInstance - supertest request instance
 * @param {string} token - JWT token
 * @returns {Object} - request with authorization header set
 */
function withAuth(requestInstance, token) {
    return requestInstance.set('Authorization', getAuthHeader(token));
}

module.exports = {
    generateTestToken,
    getAuthHeader,
    withAuth
};
