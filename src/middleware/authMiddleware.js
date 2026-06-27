const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/ApiResponse');

const AuthMiddleware = {
    verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return ApiResponse.error(res, 401, 'Access token required');
        }
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );
            req.user = decoded;
            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return ApiResponse.error(res, 401, 'Token expired');
            }
            return ApiResponse.error(res, 401, 'Invalid token');
        }
    }
};

module.exports = AuthMiddleware;