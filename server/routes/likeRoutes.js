import express from 'express';
import { addLike, removeLike, getLikedVideos, isLiked } from '../controllers/likeController.js';

const router = express.Router();

router.post('/', addLike)
router.delete('/', removeLike)
router.get('/is_liked', isLiked)
router.get('/videos', getLikedVideos);

export default router;