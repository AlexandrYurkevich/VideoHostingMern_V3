import Video from "../models/Video.js";
import View from "../models/View.js";
import Subscribe from "../models/Subscribe.js";
import Channel from "../models/Channel.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import WatchHistory from "../models/WatchHistory.js";
import SearchHistory from "../models/SearchHistory.js";
import express from 'express';

const router = express.Router();

export const addVideo = async (req, res) => {
  try {
    console.log("addVideo - " + req.body + " - " + req.body.duration)
    const newVideo = new Video({
      title: req.body.title,
      desc: req.body.desc,
      video_url: req.body.video_url,
      thumbnail_url: req.body.thumbnail_url,
      tags: req.body.tags?.split(/[,;]+/).filter(element => element),
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
export const deleteVideo = async (req, res) => {
  try {
    const videoDeleted = await Video.findByIdAndDelete(req.params.video_id);
    res.status(200).json(videoDeleted);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.video_id).populate({ path: 'channel', populate: { path: 'subs_count' } })
    .populate('likes_count dislikes_count comments_count views_count');
    res.status(200).json(video);
  }
  catch (error) { console.log(error.message); res.status(404).json({ message: error.message }) }
}

export const getVideosByChannel = async (req, res) => {
  try {
    const { channel_id, offset } = req.query
    const videos = await Video.find({ channel_id }).sort({ createdAt: -1 }).skip(offset).limit(20).populate('channel likes_count dislikes_count comments_count views_count');
    res.status(200).json(videos);
  }
  catch (error) {
    res.status(404).json({ message: error.message })
  }
}

const getLastViewedChannel = async (channel_id) => {
  const lastWatch = await WatchHistory.findOne({ channel_id }).sort({ createdAt: -1 }).populate('video_id');
  return lastWatch?.video_id.channel_id;
};

const getRecommendedVideosFilter = async (channel_id) => {
  const subscribedChannels = await Subscribe.distinct('subscribed_channel_id', { subscriber_id: channel_id });
  const last_viewed_channel = await getLastViewedChannel(channel_id);
  return { $or: [{ channel_id: { $in: subscribedChannels } }, { channel_id: last_viewed_channel }] }
};

export const getVideosByFilter = async (req, res) => {
  try {
    const offset = req.query.offset; const filter = req.query.filter; const sort = req.query.sort;
    let results = null, filter_params = {};
    if (filter?.by_pattern) {
      const regex = new RegExp(filter.by_pattern, 'i');
      filter_params.$or = [
        { title: regex },
        { desc: regex },
        { tags: { $elemMatch: { $regex: regex } } }
      ];
    }
    if (filter?.by_access) {
      filter_params.$and = [
        { access_status: { $gt: 0 } },
        {
          $or: [
            { access_status: { $gt: 1 } },
            { channel_id: filter.by_access }
          ]
        }
      ];
    } else { filter_params.access_status = 3; }
    if (!filter?.by_age || (filter?.by_age && filter.by_age < 18)) { filter_params.adult_content = false; }
    if (filter?.by_channel) { filter_params.channel_id = filter.by_channel; }
    if (filter?.by_category) { filter_params.category = filter.by_category; }
    if (filter?.by_date) { filter_params.createdAt = { $gte: filter.by_date }; }
    if (filter?.by_tags) { filter_params.tags = { $all: filter.by_tags }; }
    if (filter?.by_recommend) {
      const recommendedFilter = await getRecommendedVideosFilter(filter.by_recommend);
      filter_params.$and = filter_params.$and || [];
      filter_params.$and.push(recommendedFilter);
    } 
    results = Video.find(filter_params)//{$or: [filter_params, {access_status: 3, adult_content:false}]})
    results = results.sort(sort);
    results = await results.skip(offset).limit(20).populate('channel views_count')
    res.status(200).json(results);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getVideosHistory = async (req, res) => {
  try {
    const { channel_id, offset } = req.query
    const videos = await WatchHistory.find({ channel_id }).populate({ path: 'video_id', populate: { path: 'channel' } }).sort({ createdAt: -1 }).skip(offset).limit(20);
    res.status(200).json(videos.map(v => v.video_id));
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getSearchRequests = async (req, res) => {
  try {
    const searchString = req.query.pattern;
    console.log("search requests")
    const regexPattern = new RegExp(searchString.replace(".", "\\."), "i");
    let results = await SearchHistory.aggregate([{ $match: { request: { $regex: regexPattern } } },
    { $group: { _id: '$request', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }
    ]);
    console.log(results);
    res.status(200).json(results.map(r => r._id));
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getSearch = async (req, res) => {
  try {
    const { pattern, offset, channel_id, user_age } = req.query;
    console.log("search")
    let filter_params = {};
    if (channel_id) {
      filter_params = Object.assign(filter_params, { access_status: { $gt: 0 }, $or: [{ access_status: { $gt: 1 } }, { channel_id: channel_id },] })
    } else { filter_params = Object.assign(filter_params, { access_status: 3 }) }
    if (!user_age || user_age && user_age < 18) { filter_params = Object.assign(filter_params, { adult_content: false }) }
    const regex = new RegExp(pattern.replace(".", "\\."), "i");
    let results = Video.find({ $and: [filter_params, { $or: [{ title: regex }, { desc: regex }, { tags: { $elemMatch: { $regex: regex } } }] }] });
    results = await results.skip(offset).limit(20).populate('channel views_count')
    results && await SearchHistory.create({ channel_id, request: pattern })
    res.status(200).json(results);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const addView = async (req, res) => {
  try {
    const newView = new View(req.body);
    const created = await newView.save();
    if (req.body.channel_id)
      await WatchHistory.findOneAndUpdate(req.body, { $set: req.body }, { upsert: true });
    res.status(201).json(created);
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const editVideo = async (req, res) => {
  try {
    const update = await Video.findByIdAndUpdate(req.params.video_id, { $set: req.body }, { new: true });
    res.status(200).json(update);
  } catch (error) { res.status(404).json({ message: error.message }) }
}

export const editThumbnail = async (req, res) => {
  try {
    const old = await Channel.findByIdAndUpdate(req.params.video_id,
      { $set: { thumbnail_url: req.body.new_url } });
    fs.unlinkSync(`${__dirname}'\\public\\${old.thumbnail_url}`)
    res.status(200).json(old);
  } catch (error) { res.status(404).json({ message: error.message }) }
}

export default router;
