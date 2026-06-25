const db = require('../config/database');

class UserService {
    static async getUserById(userId) {
        const query = `
            SELECT id, fullname, username, email, profile_photo, is_verified, created_at
            FROM users
            WHERE id = ?
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows[0];
    }
    static async updateProfilePhoto(userId, photoPath) {
        const query = `
            UPDATE users
            SET profile_photo = ?
            WHERE id = ?
        `;
        await db.execute(query, [photoPath, userId]);
    }
    static async updateProfile(userId, { fullname, username }) {
        if (username) {
            const [existingUsers] = await db.execute(
                'SELECT id FROM users WHERE username = ? AND id != ?',
                [username, userId]
            );
            if (existingUsers.length > 0) {
                const error = new Error('Username already exists');
                error.statusCode = 409;
                throw error;
            }
        }
        const query = `
            UPDATE users
            SET fullname = COALESCE(?, fullname),
                username = COALESCE(?, username)
            WHERE id = ?
        `;
        await db.execute(query, [fullname, username, userId]);
        return await this.getUserById(userId);
    }
}

module.exports = UserService;