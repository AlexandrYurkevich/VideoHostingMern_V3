
import express from 'express';
import Like from '../models/Like.js';
const router = express.Router();

export const addLike = async (req,res)=>{
  try {
    const newLike = new Like(req.body);
    const created = await newLike.save();
    res.status(201).json(created);
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const removeLike = async (req,res)=>{
  try {
    const deleted = await Like.findOneAndDelete(req.query);
    res.status(200).json(deleted);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const isLiked = async (req, res) => {
  try {
    const result = await Like.findOne(req.query);
    res.status(200).json(result);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getLikedVideos = async (req,res)=>{
  try {
      const videos = await Like.distinct('video_id', {channel_id:req.query.channel_id}).populate('video_id').skip(req.query.offset).limit(20);
      res.status(200).json(videos);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export default router;