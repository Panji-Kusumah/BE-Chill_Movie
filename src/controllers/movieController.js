const MovieService = require('../services/movieService');
const ApiResponse = require('../utils/ApiResponse');

const MovieController = {
    async getAllMovies(req, res) {
        try {
            const filters = {
                genre: req.query.genre,
                search: req.query.search,
                sortBy: req.query.sortBy
            };
            const movies = await MovieService.getAllMovies(filters);
            return ApiResponse.success(
                res,
                200,
                movies,
                'Movies retrieved successfully'
            );
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async getMovieById(req, res) {
        try {
            const movie = await MovieService.getMovieById(req.params.id);
            if (!movie) {
                return ApiResponse.notFound(res, 'Movie not found');
            }
            return ApiResponse.success(
                res,
                200,
                movie,
                'Movie retrieved successfully'
            );
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async createMovie(req, res) {
        try {
            const { genre_ids, ...movieData } = req.body;
            const newId = await MovieService.createMovie(
                movieData,
                genre_ids
            );
            return ApiResponse.created(
                res,
                { movie_id: newId },
                'Movie created successfully'
            );
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async updateMovie(req, res) {
        try {
            const existing = await MovieService.getMovieById(req.params.id);
            if (!existing) {
                return ApiResponse.notFound(res, 'Movie not found');
            }
            await MovieService.updateMovie(
                req.params.id,
                req.body
            );
            return ApiResponse.success(
                res,
                200,
                null,
                'Movie updated successfully'
            );
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async deleteMovie(req, res) {
        try {
            const existing = await MovieService.getMovieById(req.params.id);
            if (!existing) {
                return ApiResponse.notFound(res, 'Movie not found');
            }
            await MovieService.deleteMovie(req.params.id);
            return ApiResponse.success(
                res,
                200,
                null,
                'Movie deleted successfully'
            );
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
};

module.exports = MovieController;