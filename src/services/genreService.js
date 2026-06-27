const db = require('../config/database');

const GenreService = {
    async getAllGenres() {
        try {
            const [rows] = await db.execute('SELECT * FROM genres');
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch genres: ${error.message}`);
        }
    },
    async getGenreById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM genres WHERE genre_id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Failed to fetch genre: ${error.message}`);
        }
    },
    async createGenre(nama_genre) {
        if (!nama_genre || nama_genre.trim() === '') {
            throw new Error('Genre name cannot be empty');
        }
        try {
            const [result] = await db.execute('INSERT INTO genres (nama_genre) VALUES (?)', [nama_genre.trim()]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Failed to create genre: ${error.message}`);
        }
    },
    async deleteGenre(id) {
        try {
            await db.execute('DELETE FROM genres WHERE genre_id = ?', [id]);
        } catch (error) {
            throw new Error(`Failed to delete genre: ${error.message}`);
        }
    }
};

module.exports = GenreService;