const jwt = require('jsonwebtoken');

const generateTestToken = (payload = {}, secret = process.env.JWT_SECRET) => {
    return jwt.sign({
        userId: 1,
        email: 'test@example.com',
        username: 'testuser',
        ...payload
    }, secret, { expiresIn: '24h' });
};
const getAuthHeader = (token) => `Bearer ${token}`;
const withAuth = (requestInstance, token) => 
    requestInstance.set('Authorization', getAuthHeader(token));
module.exports = { generateTestToken, getAuthHeader, withAuth };