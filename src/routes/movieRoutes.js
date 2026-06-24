const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware.verifyToken);
router.get('/movies', MovieController.getAllMovies);
router.get('/movie/:id', MovieController.getMovieById);
router.post('/movie', MovieController.createMovie);
router.patch('/movie/:id', MovieController.updateMovie);
router.delete('/movie/:id', MovieController.deleteMovie);
module.exports = router;