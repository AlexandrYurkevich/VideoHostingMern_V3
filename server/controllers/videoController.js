import Video from "../models/Video.js";
import View from "../models/View.js";
import Subscribe from "../models/Subscribe.js";
import Channel from "../models/Channel.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import express from 'express';

const router = express.Router();

export const addVideo = async (req,res)=>{
  try {
    const newVideo = new Video({
      title: req.body.title,
      desc: req.body.desc,
      video_url: req.body.video_url,
      thumbnail_url: req.body.thumbnail_url,
      tags: req.body.tags?.split(/[\s,-.;]+/).filter(element => element),
      channel_id: req.body.channel_id,
      duration: req.body.duration,
      access_status: 0
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
    const videoDeleted = await Video.findByIdAndDelete(req.params.video_id);
    res.status(200).json(videoDeleted);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getVideo = async (req,res)=>{
  try {
    const video = await Video.findById(req.params.video_id).populate('channel likes_count dislikes_count comments_count views_count');
    res.status(200).json(video);
  }
  catch (error) { console.log(error.message); res.status(404).json({ message: error.message }) }
}

export const getVideosByChannel = async (req,res)=>{
    try {
      const { channel_id, offset } = req.query
      const videos = await Video.find({channel_id}).skip(offset).limit(20).populate('channel');
      res.status(200).json(videos);
    }
    catch (error) {
      res.status(404).json({ message: error.message })
    }
}

const getLastViewedChannel = async (channel_id) => {
  const lastView = await View.findOne({channel_id}).sort({createdAt: -1});
  return lastView.channel_id;
};

const getRecommendedVideosFilter = async (channel_id) => {
  const subscribedChannels = await Subscribe.distinct('subscribed_channel_id', { subscriber_id: channel_id });
  const last_viewed_channel = await getLastViewedChannel(channel_id);
  return { $or: [ {channel_id: { $in: subscribedChannels }},{ channel_id: last_viewed_channel}] };
};

export const getVideosByFilter = async (req,res)=>{
  try {
    const offset = req.query.offset;
    const filter = req.query.filter;
    const sort = req.query.sort;
    let results = null, filter_params = {access_status: 2}, sort_params = {};
    if(filter?.by_channel) { filter_params = Object.assign(filter_params, { channel_id: filter.by_channel }) }
    if(filter?.by_category) { filter_params = Object.assign(filter_params, { category: filter.by_category }) }
    if(filter?.by_date) { filter_params = Object.assign(filter_params, { updatedAt: { gte: filter.by_date } }) }
    if(filter?.by_tags) { filter_params = Object.assign(filter_params, { tags: { $all: filter.by_tags } }) }
    if(filter?.by_recommend) { filter_params = Object.assign(filter_params, await getRecommendedVideosFilter(filter.by_recommend)) }
    results = Video.find({$or: [filter_params, {access_status: 2}]})
    if(sort?.by_date) sort_params = Object.assign(sort_params, {updatedAt: sort.by_date})
    if(sort?.by_date) sort_params = Object.assign(sort_params, {updatedAt: -1})
    results = results.sort(sort_params);
    results = await results.skip(offset).limit(20).populate('channel')
    res.status(200).json(results);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getVideosHistory = async (req,res)=>{
  try {
      const { channel_id, offset } = req.query
      const videos = await WatchHistory.find({channel_id}).select('video_id').populate('video').skip(offset).limit(20);
      res.status(200).json(videos);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getSearch = async (req,res)=>{
  try {
    const stype = req.query.stype; const searchString = req.query.pattern;
    const regex = new RegExp(searchString.replace(".","\\."), "i");
    let results = Video.find({ $or: [{title: regex }, {description: regex}, { tags: { $elemMatch: { $regex: regex } } } ] });
    switch (stype) {
      case "byviews":
        results = await results.sort({views: -1}).skip(req.query.index).limit(20);
        break;
      case "bydate":
        results = await results.sort({createdAt: -1}).skip(req.query.index).limit(20);
        break;
      default:
        results = await results.skip(req.query.index).limit(20);
        break;
    }
    res.status(200).json(results);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const addView = async (req,res)=>{
  try {
    const newView = new View(req.body);
    const created = await newView.save();
    res.status(201).json(created);
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const editVideo = async (req,res)=>{
  try {
      const update = await Channel.findByIdAndUpdate(req.params.video_id,
      {$set: req.body},
      {new: true });
      res.status(200).json(update);
  } catch (error) { res.status(404).json({ message: error.message }) }
}

export const editThumbnail = async (req,res)=>{
  try {
      const old = await Channel.findByIdAndUpdate(req.params.video_id,
      {$set:{ thumbnail_url: req.body.new_url} });
      fs.unlinkSync(`${__dirname}'\\public\\${old.thumbnail_url}`)
      res.status(200).json(old);
  } catch (error) { res.status(404).json({ message: error.message }) }
}

export default router;
