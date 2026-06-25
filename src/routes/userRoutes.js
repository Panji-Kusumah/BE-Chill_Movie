const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.use(authMiddleware.verifyToken);
router.get('/profile', UserController.getProfile);
router.patch('/profile', UserController.updateProfile);
router.patch('/profile/photo', upload.single('photo'), UserController.updateProfilePhoto);

module.exports = router;