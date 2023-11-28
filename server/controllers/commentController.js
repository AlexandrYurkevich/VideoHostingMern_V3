

import express from 'express';
import Comment from '../models/Comment.js';
import Video from '../models/Video.js';
const router = express.Router();

export const getComment = async (req,res)=>{
  try {
    const comment = await Comment.findById(req.params.comment_id).populate('channel');
    res.status(200).json(comment);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getCommentsByVideo = async (req,res)=>{
  try {
    const { video_id, offset } = req.query
    const comments = await Comment.find({video_id}).skip(offset).limit(20).populate('channel');
    res.status(200).json(comments);
  }
  catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getCommentsByChannel = async (req,res)=>{
    try {
      const { channel_id, offset } = req.query
      const comments = await Comment.find({channel_id}).skip(offset).limit(20).populate('channel');
      res.status(200).json(comments);
    }
    catch (error) {
      res.status(404).json({ message: error.message })
    }
}

export const getCommentsOnChannel = async (req,res)=>{
    try {
      const { channel_id, offset } = req.query
      Video.find({channel_id}).then(videos => {
          const videos_on_channel = videos.map(video => video._id);
          const comments = Comment.find({ video_id: { $in: videos_on_channel } }).skip(offset).limit(20).populate('channel');
          res.status(200).json(comments);
      })
      .catch(error => {
          res.status(404).json({ message: error.message })
      });
    }
    catch (error) {
      res.status(404).json({ message: error.message })
    }
}

export const deleteComment = async (req,res)=>{
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.comment_id);
    res.status(200).json(deleted);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const addComment = async (req,res)=>{
  try {
    const newComment = new Comment(req.body);
    const created = await newComment.save();
    res.status(201).json(created);
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export default router;