import express from 'express';
import { } from '../controllers/playlistController.js';

const router = express.Router();

axios.get('/videos', getPlaylistVideos)
axios.get('/videoIds', getPlaylistVideoIds)
axios.get('/byChannel',getPlaylistsByChannel)
axios.get('/:playlist_id', getPlaylist)
axios.delete('/:playlist_id', deletePlaylist)
axios.post('/addVideos', addVideosToPlaylist)
axios.post('/', addPlaylist)

export default router;