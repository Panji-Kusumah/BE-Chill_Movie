const resend = require('../utils/emailConfig');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../config/database');

class EmailService {
    static async sendVerificationEmail(email, fullname) {
        try {
            // 1. Generate token verifikasi
            const token = uuidv4();
            
            // 2. Hash token untuk disimpan di database
            const hashedToken = await bcrypt.hash(token, 10);
            
            // 3. Simpan hashed token ke database
            await db.execute(
                'UPDATE users SET verification_token = ? WHERE email = ?',
                [hashedToken, email]
            );
            // 4. Buat link verifikasi (gunakan plain token di URL)
            const verificationLink = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
            // 5. Kirim email via Resend
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
                throw new Error('Failed to send verification email');
            }
            return token;
        } catch (error) {
            throw new Error(`Email service error: ${error.message}`);
        }
    }
    static async verifyEmail(token) {
        try {
            // 1. Cari semua user dengan token tidak null
            const [users] = await db.execute(
                'SELECT id, email, is_verified, verification_token FROM users WHERE is_verified = false'
            );
            // 2. Cari user dengan token yang sama
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
            // 3. Cek apakah sudah terverifikasi
            if (user.is_verified) {
                const error = new Error('Email already verified');
                error.statusCode = 400;
                throw error;
            }
            // 4. Update status verifikasi
            await db.execute(
                'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?',
                [user.id]
            );
            return { email: user.email };
        } catch (error) {
            throw new Error(`Email verification error: ${error.message}`);
        }
    }
}

module.exports = EmailService;