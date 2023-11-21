import Video from "../models/Video.js";
import express from 'express';
import User from "../models/User.js";
import Channel from "../models/Channel.js";

const router = express.Router();

export const addVideo = async (req,res)=>{
  try {
    const newVideo = new Video({
      title: req.body.title,
      desc: req.body.desc,
      video_url: req.body.video_url,
      thumbnail_url: req.body.thumbnail_url,
      tags: req.body.tags.split(/[\s,-.;]+/).filter(element => element),
      channel_id: req.body.channel_id
    });
    const video = await newVideo.save();
    res.status(201).json(video);
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export const deleteVideo = async (req,res)=>{
  try {
    const videoDeleted = await Video.findByIdAndDelete(req.params.id);
    res.status(200).json(videoDeleted);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getVideosCount = async (req,res)=>{
  try {
    const video_count = await Video.countDocuments({channel_id : req.params.channel_id});
    res.status(200).json(video_count);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}
export const getVideo = async (req,res)=>{
  try {
    const video = await Video.findById(req.params.id).populate('channel');
    res.status(200).json(video);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getVideosByChannel = async (req,res)=>{
    try {
      const { channel_id, offset } = req.query
      const videos = await Video.find({channel_id}).skip(offset).limit(20);
      res.status(200).json(videos);
    }
    catch (error) {
      res.status(404).json({ message: error.message })
    }
}
export const getVideosByTag = async (req,res)=>{
  try {
    const { selectedTagType, selectedTagValue, index, offset } = req.query;
    let videos = null;
    switch (selectedTagType) {
      case "all": videos = await Video.find().skip(index).limit(offset); break;
      case "byviews": videos = await Video.find().sort({views: -1}).skip(index).limit(offset); break;
      case "bydate": videos = await Video.find().sort({createdAt: -1}).skip(index).limit(offset); break;
      case "bytag": videos = await Video.find({ tags: { $elemMatch: { $eq: selectedTagValue } } }).skip(index).limit(offset); break;
      case "bychannel": videos = await Video.find({ channel: selectedTagValue}).skip(index).limit(offset); break;
      default: console.log("fallback"); break;
    }
    res.status(200).json(videos);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getLikedVideos = async (req,res)=>{
  try {
      const videos = await User.findById(req.params.userid).select('liked').populate('liked').skip(req.params.index).limit(20);
      res.status(200).json(videos);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getVideosHistory = async (req,res)=>{
  try {
      const videos = await User.findById(req.params.userId).select('history').populate('history').skip(req.params.index).limit(20);
      res.status(200).json(videos);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getSearch = async (req,res)=>{
  try {
    const stype = req.query.stype; const searchString = req.query.pattern;
    const regex = new RegExp(searchString.replace(".","\\."), "i");
    let results = null;
    switch (stype) {
      case "byviews":
        results = await Video.find(
          { $or: [{title: regex }, {description: regex}, { tags: { $elemMatch: { $regex: regex } } } ] 
          }).sort({views: -1}).skip(req.query.index).limit(20);
        break;
      case "bydate":
        results = await Video.find(
          { $or: [{title: regex }, {description: regex}, { tags: { $elemMatch: { $regex: regex } } } ] 
          }).sort({createdAt: -1}).skip(req.query.index).limit(20);
        break;
      default:
        results = await Video.find(
          { $or: [{title: regex }, {description: regex},{ tags: { $elemMatch: { $regex: regex } } }] 
          }).skip(req.query.index).limit(20);
        break;
    }
    res.status(200).json(results);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export default router;
