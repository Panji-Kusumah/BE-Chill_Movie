const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Proteksi semua route user
router.use(authMiddleware.verifyToken);
// Get profile
router.get('/profile', UserController.getProfile);
// Upload profile photo
router.patch('/profile/photo', upload.single('photo'), UserController.updateProfilePhoto);
module.exports = router;