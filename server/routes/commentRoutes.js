import express from 'express';
import { getComment, getCommentsByVideo, getCommentsByChannel, getCommentsOnChannel, deleteComment, addComment } from '../controllers/commentController.js';

const router = express.Router();

router.get('/byVideo', getCommentsByVideo)
router.get('/byChannel', getCommentsByChannel)
router.get('/byChannel', getCommentsOnChannel)
router.get('/:comment_id', getComment)
router.delete('/:comment_id', deleteComment)
router.post('/', addComment)

export default router;