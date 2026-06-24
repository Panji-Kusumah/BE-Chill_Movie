const db = require('../config/database');

class MovieService {
    static async getAllMovies(filters = {}) {
        try {
            const { genre, search, sortBy } = filters;
            
            let query = `
                SELECT m.*, GROUP_CONCAT(g.nama_genre) as genres
                FROM movies m
                LEFT JOIN movie_genres mg ON m.movie_id = mg.movie_id
                LEFT JOIN genres g ON mg.genre_id = g.genre_id
            `;
            
            const conditions = [];
            const params = [];

            // Filter by genre
            if (genre) {
                conditions.push('g.nama_genre = ?');
                params.push(genre);
            }

            // Search by title
            if (search) {
                conditions.push('m.title LIKE ?');
                params.push(`%${search}%`);
            }

            // Add WHERE clause jika ada conditions
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            // Group by movie
            query += ' GROUP BY m.movie_id';

            // Sort with whitelist validation to prevent SQL injection
            if (sortBy) {
                const validSorts = ['title', 'release_year', 'duration', 'rating'];
                if (validSorts.includes(sortBy)) {
                    query += ` ORDER BY m.${sortBy} ASC`;
                }
            }

            const [rows] = await db.execute(query, params);
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch movies: ${error.message}`);
        }
    }

    static async getMovieById(id) {
        try {
            const query = `
                SELECT m.*, GROUP_CONCAT(g.nama_genre) as genres
                FROM movies m
                LEFT JOIN movie_genres mg ON m.movie_id = mg.movie_id
                LEFT JOIN genres g ON mg.genre_id = g.genre_id
                WHERE m.movie_id = ?
                GROUP BY m.movie_id
            `;
            const [rows] = await db.execute(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Failed to fetch movie: ${error.message}`);
        }
    }

    static async createMovie(movieData, genre_ids) {
        const { title, description, release_year, duration, rating, poster_url } = movieData;
        
        // Validate required fields
        if (!title) {
            throw new Error('Title is required');
        }
        
        try {
            const query = `
                INSERT INTO movies (title, description, release_year, duration, rating, poster_url)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [
                title, description, release_year, duration, rating, poster_url
            ]);

            const movieId = result.insertId;

            // Insert genre relations
            if (genre_ids && genre_ids.length > 0) {
                for (const genreId of genre_ids) {
                    const genreQuery = 'INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)';
                    await db.execute(genreQuery, [movieId, genreId]);
                }
            }
            return movieId;
        } catch (error) {
            throw new Error(`Failed to create movie: ${error.message}`);
        }
    }
    static async updateMovie(id, movieData) {
        try {
            const { title, description, release_year, duration, rating, poster_url } = movieData;
            
            const query = `
                UPDATE movies 
                SET title = ?, description = ?, release_year = ?, duration = ?, rating = ?, poster_url = ?
                WHERE movie_id = ?
            `;
            await db.execute(query, [
                title, description, release_year, duration, rating, poster_url, id
            ]);
        } catch (error) {
            throw new Error(`Failed to update movie: ${error.message}`);
        }
    }
    static async deleteMovie(id) {
        try {
            const query = 'DELETE FROM movies WHERE movie_id = ?';
            await db.execute(query, [id]);
        } catch (error) {
            throw new Error(`Failed to delete movie: ${error.message}`);
        }
    }
}

module.exports = MovieService;