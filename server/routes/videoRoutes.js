import express from 'express';

import { addVideo, addView, deleteVideo, editThumbnail, editVideo, getSearch, getSearchRequests, getVideo, getVideosByChannel, getVideosByFilter, getVideosHistory } from '../controllers/videoController.js';

const router = express.Router();

router.post('/', addVideo);
router.delete('/:video_id', deleteVideo);
router.get('/filter', getVideosByFilter);
router.get('/history', getVideosHistory); 
router.get('/byChannel', getVideosByChannel);  
router.get('/searchRequests', getSearchRequests);
router.get('/search', getSearch);
router.post('/addView', addView)
router.put('/editVideo/:video_id', editVideo)
router.put('/editThumbnail/:video_id', editThumbnail)
router.get('/:video_id', getVideo);

export default router;