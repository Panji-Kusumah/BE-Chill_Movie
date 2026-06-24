const EpisodeService = require('../services/episodeService');
const ApiResponse = require('../utils/ApiResponse');

class EpisodeController {
    static async getAllEpisodes(req, res) {
        try {
            const episodes = await EpisodeService.getAllEpisodes();
            return ApiResponse.success(res, 200, episodes, 'Episodes retrieved successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
    static async getEpisodeById(req, res) {
        try {
            const episode = await EpisodeService.getEpisodeById(req.params.id);
            if (!episode) {
                return ApiResponse.notFound(res, 'Episode not found');
            }
            return ApiResponse.success(res, 200, episode, 'Episode retrieved successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
    static async getEpisodesBySeries(req, res) {
        try {
            const episodes = await EpisodeService.getEpisodesBySeries(req.params.seriesId);
            return ApiResponse.success(res, 200, episodes, 'Episodes retrieved successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
    static async createEpisode(req, res) {
        try {
            const newId = await EpisodeService.createEpisode(req.body);
            return ApiResponse.created(res, { episode_id: newId }, 'Episode created successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
    static async updateEpisode(req, res) {
        try {
            const existing = await EpisodeService.getEpisodeById(req.params.id);
            if (!existing) {
                return ApiResponse.notFound(res, 'Episode not found');
            }
            await EpisodeService.updateEpisode(req.params.id, req.body);
            return ApiResponse.success(res, 200, null, 'Episode updated successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
    static async deleteEpisode(req, res) {
        try {
            const existing = await EpisodeService.getEpisodeById(req.params.id);
            if (!existing) {
                return ApiResponse.notFound(res, 'Episode not found');
            }
            await EpisodeService.deleteEpisode(req.params.id);
            return ApiResponse.success(res, 200, null, 'Episode deleted successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
}
module.exports = EpisodeController;