const express = require('express');
const router = express.Router();
const EpisodeController = require('../controllers/episodeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);
router.get('/episodes', EpisodeController.getAllEpisodes);
router.get('/episode/series/:seriesId', EpisodeController.getEpisodesBySeries);
router.get('/episode/:id', EpisodeController.getEpisodeById);
router.post('/episode', EpisodeController.createEpisode);
router.patch('/episode/:id', EpisodeController.updateEpisode);
router.delete('/episode/:id', EpisodeController.deleteEpisode);
module.exports = router;