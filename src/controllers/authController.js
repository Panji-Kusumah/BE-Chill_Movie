const authService = require('../services/authService');
const emailService = require('../services/emailService');
const ApiResponse = require('../utils/ApiResponse');

class AuthController {
    async register(req, res, next) {
        try {
            const { fullname, username, email, password } = req.body;
            if (!fullname || !username || !email || !password) {
                const error = new Error('All fields are required');
                error.statusCode = 400;
                throw error;
            }
            const user = await authService.register({
                fullname,
                username,
                email,
                password
            });
            return ApiResponse.success(
                res,
                201,
                user,
                'User registered successfully. Please check your email to verify your account.'
            );
        } catch (error) {
            error.statusCode = error.statusCode || 500;
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                const error = new Error('Email and password are required');
                error.statusCode = 400;
                throw error;
            }
            const result = await authService.login({
                email,
                password
            });
            return ApiResponse.success(
                res,
                200,
                result,
                'Login successful'
            );
        } catch (error) {
            error.statusCode = error.statusCode || 500;
            next(error);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const { token } = req.query;
            if (!token) {
                const error = new Error('Verification token is required');
                error.statusCode = 400;
                throw error;
            }
            const result = await emailService.verifyEmail(token);
            return ApiResponse.success(
                res,
                200,
                result,
                'Email verified successfully'
            );
        } catch (error) {
            error.statusCode = error.statusCode || 500;
            next(error);
        }
    }
}

module.exports = new AuthController();