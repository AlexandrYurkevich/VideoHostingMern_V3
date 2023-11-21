import express from 'express';
import { addSubscribe, deleteSubscribe, getIsSubscribed, getSubsCount } from '../controllers/subscribeController.js';
const router = express.Router();

router.get('/count/:subscribed_id', getSubsCount);
router.get('/is_sub', getIsSubscribed);
router.get('/add_subscribe', addSubscribe);
router.delete('/unsubscribe', deleteSubscribe);

export default router;