import express from 'express';
import { addPlaylist, addVideosToPlaylist, deletePlaylist, getPlaylist, getPlaylistsByChannel, getPlaylistsVideoIds, getPlaylistsVideos } from '../controllers/playlistController.js';

const router = express.Router();

router.get('/videos', getPlaylistsVideos)
router.get('/videoIds', getPlaylistsVideoIds)
router.get('/byChannel',getPlaylistsByChannel)
router.get('/:playlist_id', getPlaylist)
router.delete('/:playlist_id', deletePlaylist)
router.post('/addVideos', addVideosToPlaylist)
router.post('/', addPlaylist)

export default router;