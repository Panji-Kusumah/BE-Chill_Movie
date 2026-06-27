const AuthService = require('../services/authService');
const EmailService = require('../services/emailService');

const AuthController = {
    async register(req, res, next) {
        try {
            const { fullname, username, email, password } = req.body;
            if (!fullname || !username || !email || !password) {
                const error = new Error('All fields are required');
                error.statusCode = 400;
                throw error;
            }
            const user = await AuthService.register({ fullname, username, email, password });
            res.status(201).json({
                success: true,
                message: 'User registered successfully. Please check your email to verify your account.',
                data: user
            });
        } catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login({ email, password });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },
    async verifyEmail(req, res, next) {
        try {
            const { token } = req.query;
            if (!token) {
                const error = new Error('Verification token is required');
                error.statusCode = 400;
                throw error;
            }
            const result = await EmailService.verifyEmail(token);
            res.status(200).json({
                success: true,
                message: 'Email verified successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = AuthController;