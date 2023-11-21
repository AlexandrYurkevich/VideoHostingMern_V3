import express from 'express';
import {
    addLike, removeLike, removeDislike, addDislike,
    getChannel, getUser,
    addView,
    subscribe, unsubscribe } from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId', getUser);

export default router;