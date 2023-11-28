import express from 'express';
import { getChannel, addRecommendedChannel, editChannel, deleteChannel, getRecommendedChannels, removeRecommendedChannel, editAvatar, editBanner } from '../controllers/channelController.js';

const router = express.Router();

router.get('/:channel_id', getChannel)
router.delete('/:channel_id', deleteChannel)
router.get('/recommend/:channel_id', getRecommendedChannels)
router.put('/addRecommend/:channel_id', addRecommendedChannel)
router.put('/removeRecommend', removeRecommendedChannel)
router.put('/edit/:channel_id', editChannel)//form
router.put('/editAvatar/:channel_id', editAvatar)//new_url
router.put('/editBanner/:channel_id', editBanner)//new_url

export default router;