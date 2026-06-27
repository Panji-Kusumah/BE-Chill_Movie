const GenreService = require('../services/genreService');
const ApiResponse = require('../utils/ApiResponse');

const GenreController = {
    async getAllGenres(req, res) {
        try {
            const genres = await GenreService.getAllGenres();
            return ApiResponse.success(res, 200, genres, 'Genres retrieved successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async getGenreById(req, res) {
        try {
            const genre = await GenreService.getGenreById(req.params.id);
            if (!genre) {
                return ApiResponse.notFound(res, 'Genre not found');
            }
            return ApiResponse.success(res, 200, genre, 'Genre retrieved successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async createGenre(req, res) {
        try {
            const { nama_genre } = req.body;
            if (!nama_genre) {
                return ApiResponse.error(res, 400, 'nama_genre is required');
            }
            const newId = await GenreService.createGenre(nama_genre);
            return ApiResponse.created(res, { genre_id: newId }, 'Genre created successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async deleteGenre(req, res) {
        try {
            const existing = await GenreService.getGenreById(req.params.id);
            if (!existing) {
                return ApiResponse.notFound(res, 'Genre not found');
            }
            await GenreService.deleteGenre(req.params.id);
            return ApiResponse.success(res, 200, null, 'Genre deleted successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
};

module.exports = GenreController;