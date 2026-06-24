const db = require('../config/database');

class UserService {
    static async getUserById(userId) {
        try {
            const query = `
                SELECT id, fullname, username, email, profile_photo, is_verified, created_at
                FROM users
                WHERE id = ?
            `;
            const [rows] = await db.execute(query, [userId]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    }
    static async updateProfilePhoto(userId, photoPath) {
        try {
            const query = `
                UPDATE users
                SET profile_photo = ?
                WHERE id = ?
            `;
            await db.execute(query, [photoPath, userId]);
        } catch (error) {
            throw new Error(`Failed to update profile photo: ${error.message}`);
        }
    }
}

module.exports = UserService;