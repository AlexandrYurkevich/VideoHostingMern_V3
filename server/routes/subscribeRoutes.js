import express from 'express';
import { addNotifications, addSubscribe, deleteSubscribe, getIsSubscribed } from '../controllers/subscribeController.js';
const router = express.Router();

router.get('/is_sub', getIsSubscribed);
router.post('/notify', addNotifications);
router.post('/', addSubscribe);
router.delete('/', deleteSubscribe);

export default router;