const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const EmailService = require('./emailService');

class AuthService {

    async register(userData) {
        const { fullname, username, email, password } = userData;
        if (!fullname || !username || !email || !password) {
            const error = new Error('All fields (fullname, username, email, password) are required');
            error.statusCode = 400;
            throw error;
        }
        if (password.length < 6) {
            const error = new Error('Password must be at least 6 characters');
            error.statusCode = 400;
            throw error;
        }
        try {
            const [existingUsers] = await db.execute(
                'SELECT id FROM users WHERE email = ? OR username = ?',
                [email.toLowerCase(), username]
            );
            if (existingUsers.length > 0) {
                const error = new Error('Email or username already exists');
                error.statusCode = 409;
                throw error;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await db.execute(
                `INSERT INTO users (fullname, username, email, password, is_verified) VALUES (?, ?, ?, ?, ?)`,
                [fullname, username, email.toLowerCase(), hashedPassword, false]
            );
            try {
                await EmailService.sendVerificationEmail(email, fullname);
            } catch (emailError) {
                console.error('Failed to send verification email:', emailError.message);
            }
            const [users] = await db.execute(
                `SELECT id, fullname, username, email, profile_photo, is_verified, created_at FROM users WHERE id = ?`,
                [result.insertId]
            );
            return users[0];
        } catch (error) {
            if (error.statusCode) throw error;
            throw new Error(`Registration failed: ${error.message}`);
        }
    }
    async login({ email, password }) {
        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.statusCode = 400;
            throw error;
        }
        try {
            const [users] = await db.execute(
                `SELECT id, fullname, username, email, password, is_verified FROM users WHERE email = ?`,
                [email.toLowerCase()]
            );
            if (users.length === 0) {
                throw Object.assign(
                    new Error('Invalid email or password'),
                    { statusCode: 401 }
                );
            }
            const user = users[0];
            const valid = await bcrypt.compare(
                password,
                user.password
            );
            if (!valid) {
                throw Object.assign(
                    new Error('Invalid email or password'),
                    { statusCode: 401 }
                );
            }
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not configured');
            }
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    username: user.username
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            const { password: _, ...userWithoutPassword } = user;
            return {
                user: userWithoutPassword,
                token
            };
        } catch (error) {
            if (error.statusCode) throw error;
            throw new Error(`Login failed: ${error.message}`);
        }
    }
}

module.exports = new AuthService();