const db = require('../config/database');

class EpisodeService {
    static async getAllEpisodes() {
        try {
            const [rows] = await db.execute(`
                SELECT em.*, sf.judul as series_judul
                FROM Episode_Movie em
                LEFT JOIN Series_Film sf ON em.series_id = sf.series_id
            `);
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch episodes: ${error.message}`);
        }
    }
    static async getEpisodeById(id) {
        try {
            const [rows] = await db.execute(`
                SELECT em.*, sf.judul as series_judul
                FROM Episode_Movie em
                LEFT JOIN Series_Film sf ON em.series_id = sf.series_id
                WHERE em.episode_id = ?
            `, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Failed to fetch episode: ${error.message}`);
        }
    }
    static async getEpisodesBySeries(seriesId) {
        try {
            const [rows] = await db.execute(`
                SELECT * FROM Episode_Movie WHERE series_id = ? ORDER BY nomor_season, nomor_episode
            `, [seriesId]);
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch episodes for series: ${error.message}`);
        }
    }
    static async createEpisode(episodeData) {
        const { series_id, judul_episode, nomor_season, nomor_episode, durasi, video_url, thumbnail_url, deskripsi, views_count } = episodeData;
        
        if (!series_id || !judul_episode || !nomor_season || !nomor_episode) {
            throw new Error('Required fields are missing');
        }
        try {
            const [result] = await db.execute(
                `INSERT INTO Episode_Movie (series_id, judul_episode, nomor_season, nomor_episode, durasi, video_url, thumbnail_url, deskripsi, views_count) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [series_id, judul_episode, nomor_season, nomor_episode, durasi, video_url, thumbnail_url, deskripsi, views_count || 0]
            );
            return result.insertId;
        } catch (error) {
            throw new Error(`Failed to create episode: ${error.message}`);
        }
    }

    static async updateEpisode(id, episodeData) {
        const { judul_episode, nomor_season, nomor_episode, durasi, video_url, thumbnail_url, deskripsi } = episodeData;
        try {
            await db.execute(
                `UPDATE Episode_Movie SET judul_episode = ?, nomor_season = ?, nomor_episode = ?, durasi = ?, video_url = ?, thumbnail_url = ?, deskripsi = ?
                WHERE episode_id = ?`,
                [judul_episode, nomor_season, nomor_episode, durasi, video_url, thumbnail_url, deskripsi, id]
            );
        } catch (error) {
            throw new Error(`Failed to update episode: ${error.message}`);
        }
    }
    static async deleteEpisode(id) {
        try {
            await db.execute('DELETE FROM Episode_Movie WHERE episode_id = ?', [id]);
        } catch (error) {
            throw new Error(`Failed to delete episode: ${error.message}`);
        }
    }
}

module.exports = EpisodeService;