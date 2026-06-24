const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles/');
    },
    filename: (req, file, cb) => {
        const userId = req.user?.userId || 'unknown';
        const ext = path.extname(file.originalname);
        const filename = `user-${userId}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'));
    }
};
// Konfigurasi multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // Max 2MB
    },
    fileFilter: fileFilter
});

module.exports = upload;