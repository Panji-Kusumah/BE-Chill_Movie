const express = require('express');
const router = express.Router();
const PackageController = require('../controllers/packageController');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware.verifyToken);
router.get('/packages', PackageController.getAllPackages);
router.get('/package/:id', PackageController.getPackageById);
router.post('/package', PackageController.createPackage);
router.patch('/package/:id', PackageController.updatePackage);
router.delete('/package/:id', PackageController.deletePackage);
module.exports = router;