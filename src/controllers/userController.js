const UserService = require('../services/userService');
const ApiResponse = require('../utils/ApiResponse');

const UserController = {
    async getProfile(req, res) {
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
    },
    async updateProfilePhoto(req, res) {
        try {
            const userId = req.user.userId;
            
            if (!req.file) {
                return ApiResponse.error(res, 400, 'No file uploaded');
            }
            const photoPath = req.file.path;
            await UserService.updateProfilePhoto(userId, photoPath);
            return ApiResponse.success(res, 200, { photo_url: photoPath }, 'Profile photo updated successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { fullname, username } = req.body;
            if (!fullname && !username) {
                return ApiResponse.error(res, 400, 'At least one field (fullname or username) is required');
            }
            const updatedUser = await UserService.updateProfile(userId, { fullname, username });
            return ApiResponse.success(res, 200, updatedUser, 'Profile updated successfully');
        } catch (error) {
            if (error.statusCode === 409) {
                return ApiResponse.error(res, 409, error.message);
            }
            return ApiResponse.error(res, 500, error.message);
        }
    }
};

module.exports = UserController;