import express from 'express';

import {
  getVideo, getVideosByTag, getVideosByChannel,
  getLikedVideos, getVideosHistory,
  getSearch,
  addVideo,
  deleteVideo
} from '../controllers/videoController.js';

const router = express.Router();

router.get('/:id', getVideo);
router.post('/', addVideo);
router.delete('/:id', deleteVideo);
router.get('/byTag', getVideosByTag);
router.get('/history', getVideosHistory); 
router.get('/byChannel', getVideosByChannel); 
router.get('/liked', getLikedVideos); 
router.get('/search', getSearch); 

export default router;