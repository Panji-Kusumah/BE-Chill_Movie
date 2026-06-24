const UserService = require('../services/userService');
const ApiResponse = require('../utils/ApiResponse');

class UserController {
    static async getProfile(req, res) {
        try {
            const userId = req.user.userId;
            const user = await UserService.getUserById(userId);
            if (!user) {
                return ApiResponse.notFound(res, 'User not found');
            }
            return ApiResponse.success(res, 200, user, 'Profile retrieved successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
    static async updateProfilePhoto(req, res) {
        try {
            const userId = req.user.userId;
            if (!req.file) {
                return ApiResponse.error(res, 400, 'No file uploaded');
            }
            // Path foto yang baru
            const photoPath = req.file.path;
            // Update di database
            await UserService.updateProfilePhoto(userId, photoPath);
            return ApiResponse.success(res, 200, { photo_url: photoPath }, 'Profile photo updated successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
}

module.exports = UserController;