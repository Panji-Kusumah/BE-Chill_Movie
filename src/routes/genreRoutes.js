const express = require('express');
const router = express.Router();
const GenreController = require('../controllers/genreController');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware.verifyToken)
router.get('/genres', GenreController.getAllGenres);
router.get('/genre/:id', GenreController.getGenreById);
router.post('/genre', GenreController.createGenre);
router.delete('/genre/:id', GenreController.deleteGenre);
module.exports = router;