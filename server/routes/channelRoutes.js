import express from 'express';
import { getChannel, addRecommendedChannel, edit } from '../controllers/channelController.js';

const router = express.Router();

router.get('/:id', getChannel);
router.put('/addRecommend', addRecommendedChannel);
router.put('/edit/:id', edit);

export default router;