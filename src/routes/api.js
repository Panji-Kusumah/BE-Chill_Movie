const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/movies', async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT sf.*, GROUP_CONCAT(g.nama_genre SEPARATOR ', ') as genres
        FROM Series_Film sf
        LEFT JOIN Series_Genre sg ON sf.series_id = sg.series_id
        LEFT JOIN Genre g ON sg.genre_id = g.genre_id
        GROUP BY sf.series_id
    `);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/movie/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(`
        SELECT sf.*, GROUP_CONCAT(g.nama_genre SEPARATOR ', ') as genres
        FROM Series_Film sf
        LEFT JOIN Series_Genre sg ON sf.series_id = sg.series_id
        LEFT JOIN Genre g ON sg.genre_id = g.genre_id
        WHERE sf.series_id = ?
        GROUP BY sf.series_id
    `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/movie', async (req, res) => {
    try {
        const {
            judul, deskripsi, tahun_rilis, rating, durasi,
            poster_url, banner_url, trailer_url, tipe,
            status, bahasa, subtitle, genre_ids
        } = req.body;
        const [result] = await db.query(
            `INSERT INTO Series_Film 
        (judul, deskripsi, tahun_rilis, rating, durasi, poster_url, banner_url, trailer_url, tipe, status, bahasa, subtitle) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [judul, deskripsi, tahun_rilis, rating, durasi, poster_url, banner_url, trailer_url, tipe, status, bahasa, subtitle]
        );
        const newId = result.insertId;
        if (genre_ids && genre_ids.length > 0) {
            const genreValues = genre_ids.map(genre_id => [newId, genre_id]);
            await db.query(
                'INSERT INTO Series_Genre (series_id, genre_id) VALUES ?',
                [genreValues]
            );
        }
        res.status(201).json({
            success: true,
            message: 'Movie added successfully',
            movie_id: newId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.patch('/movie/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            judul, deskripsi, tahun_rilis, rating, durasi,
            poster_url, banner_url, trailer_url, tipe,
            status, bahasa, subtitle
        } = req.body;
        const [existing] = await db.query('SELECT * FROM Series_Film WHERE series_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }
        await db.query(
            `UPDATE Series_Film SET 
        judul = ?, deskripsi = ?, tahun_rilis = ?, rating = ?, durasi = ?,
        poster_url = ?, banner_url = ?, trailer_url = ?, tipe = ?, 
        status = ?, bahasa = ?, subtitle = ?
        WHERE series_id = ?`,
            [judul, deskripsi, tahun_rilis, rating, durasi, poster_url, banner_url, trailer_url, tipe, status, bahasa, subtitle, id]
        );
        res.json({
            success: true,
            message: 'Movie updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete('/movie/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM Series_Film WHERE series_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        await db.query('DELETE FROM Series_Film WHERE series_id = ?', [id]);
        res.json({
            success: true,
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.get('/', (req, res) => {
    res.json({
        message: 'Chill Movie API',
        endpoints: {
            'GET /api/movies': 'Get all movies/series',
            'GET /api/movie/:id': 'Get movie by ID',
            'POST /api/movie': 'Add new movie',
            'PATCH /api/movie/:id': 'Update movie',
            'DELETE /api/movie/:id': 'Delete movie'
        }
    });
});

router.get('/db-test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ success: true, result: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;