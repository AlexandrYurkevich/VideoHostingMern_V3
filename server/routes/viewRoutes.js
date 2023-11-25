import express from 'express';
import { getViewsCount } from '../controllers/videoController.js';

const router = express.Router();

router.get('/count/:video_id',getViewsCount);

export default router;