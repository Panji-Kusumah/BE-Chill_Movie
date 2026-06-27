const PackageService = require('../services/packageService');
const ApiResponse = require('../utils/ApiResponse');

const PackageController = {
    async getAllPackages(req, res) {
        try {
            const packages = await PackageService.getAllPackages();
            return ApiResponse.success(res, 200, packages, 'Packages retrieved successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async getPackageById(req, res) {
        try {
            const pkg = await PackageService.getPackageById(req.params.id);
            if (!pkg) {
                return ApiResponse.notFound(res, 'Package not found');
            }
            return ApiResponse.success(res, 200, pkg, 'Package retrieved successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async createPackage(req, res) {
        try {
            const newId = await PackageService.createPackage(req.body);
            return ApiResponse.created(res, { package_id: newId }, 'Package created successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async updatePackage(req, res) {
        try {
            const existing = await PackageService.getPackageById(req.params.id);
            if (!existing) {
                return ApiResponse.notFound(res, 'Package not found');
            }
            await PackageService.updatePackage(req.params.id, req.body);
            return ApiResponse.success(res, 200, null, 'Package updated successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    },
    async deletePackage(req, res) {
        try {
            const existing = await PackageService.getPackageById(req.params.id);
            if (!existing) {
                return ApiResponse.notFound(res, 'Package not found');
            }
            await PackageService.deletePackage(req.params.id);
            return ApiResponse.success(res, 200, null, 'Package deleted successfully');
        } catch (error) {
            return ApiResponse.error(res, 500, error.message);
        }
    }
};

module.exports = PackageController;