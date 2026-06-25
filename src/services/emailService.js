const resend = require('../utils/emailConfig');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../config/database');

class EmailService {
    static async sendVerificationEmail(email, fullname) {
        try {
            const token = crypto.randomUUID();
            const hashedToken = await bcrypt.hash(token, 10);
            await db.execute(
                'UPDATE users SET verification_token = ? WHERE email = ?',
                [hashedToken, email]
            );
            const verificationLink = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
            const { data, error } = await resend.emails.send({
                from: `${process.env.RESEND_FROM_NAME || 'Chill Movie'} <${process.env.RESEND_FROM_EMAIL}>`,
                to: [email],
                subject: 'Verifikasi Email - Chill Movie',
                html: `
                    <h2>Halo ${fullname},</h2>
                    <p>Terima kasih sudah mendaftar di Chill Movie.</p>
                    <p>Klik tombol di bawah ini untuk verifikasi email kamu:</p>
                    <a href="${verificationLink}" 
                        style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
                        Verifikasi Email
                    </a>
                    <p>Atau copy link ini:</p>
                    <p style="word-break: break-all; color: #007bff;">${verificationLink}</p>
                    <p>Link ini akan expired dalam 24 jam.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #888; font-size: 12px;">Jika kamu tidak membuat akun ini, abaikan email ini.</p>
                `
            });
            if (error) {
                console.error('Resend API Error:', error);
                const emailError = new Error('Failed to send verification email');
                emailError.statusCode = 500;
                throw emailError;
            }
            return token;
        } catch (error) {
            if (error.statusCode) throw error;
            const wrappedError = new Error(`Email service error: ${error.message}`);
            wrappedError.statusCode = 500;
            throw wrappedError;
        }
    }
    static async verifyEmail(token) {
        try {
            const [users] = await db.execute(
                'SELECT id, email, is_verified, verification_token FROM users WHERE is_verified = false'
            );
            let user = null;
            for (const u of users) {
                try {
                    const isMatch = await bcrypt.compare(token, u.verification_token);
                    if (isMatch) {
                        user = u;
                        break;
                    }
                } catch (err) {
                    continue;
                }
            }
            if (!user) {
                const error = new Error('Invalid verification token');
                error.statusCode = 400;
                throw error;
            }
            if (user.is_verified) {
                const error = new Error('Email already verified');
                error.statusCode = 400;
                throw error;
            }
            await db.execute(
                'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?',
                [user.id]
            );
            return { email: user.email };
        } catch (error) {
            if (error.statusCode) throw error;
            const wrappedError = new Error(`Email verification error: ${error.message}`);
            wrappedError.statusCode = 500;
            throw wrappedError;
        }
    }
}

module.exports = EmailService;