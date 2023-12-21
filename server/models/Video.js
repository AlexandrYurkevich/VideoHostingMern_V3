import mongoose from 'mongoose'
import fs from 'fs';
import View from "../models/View.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Like from './Like.js';
import Comment from './Comment.js';
import WatchHistory from './WatchHistory.js';
import Video_Playlist from './Video_Playlist.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

const VideoSchema = mongoose.Schema(
  {
    channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
    title: String,
    desc: String,
    duration: Number,
    video_url: String,
    thumbnail_url: String,
    tags: [String],
    category: String,
    adult_content: Boolean,
    allow_comments: Boolean,
    access_status: { type: Number, default: 0 }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
VideoSchema.virtual('views_count', {
  ref: 'View',
  localField: '_id',
  foreignField: 'video_id',
  count: true
});
VideoSchema.virtual('comments_count', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'video_id',
  count: true
});
VideoSchema.virtual('likes_count', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'video_id',
  count: true,
  match: { is_dislike: false }
});
VideoSchema.virtual('dislikes_count', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'video_id',
  count: true,
  match: { is_dislike: true }
});
VideoSchema.virtual('channel', {
  ref: 'Channel',
  localField: 'channel_id',
  foreignField: '_id',
  justOne: true
});
VideoSchema.pre('findOneAndDelete', async function (next) {
  const video = await this.model.findOne(this.getQuery());
  if (!video) { return next(); }
  try {
    const videoFilePath = `${__dirname}\\public\\${video.video_url}`
    fs.unlink(videoFilePath, (err) => { if (err) { console.error(`Error deleting video file: ${err}`); } });
    const thumbnailFilePath = `${__dirname}\\public\\${video.thumbnail_url}`
    fs.unlink(thumbnailFilePath, (err) => { if (err) { console.error(`Error deleting thumbnail file: ${err}`); } });
    await Comment.deleteMany({ video_id: video._id });
    await Like.deleteMany({ video_id: video._id });
    await View.deleteMany({ video_id: video._id });
    await Video_Playlist.deleteMany({ video_id: video._id });
    await WatchHistory.deleteMany({ video_id: video._id });
    next();
  } catch (error) { return next(error); }
});
  
const Video = mongoose.model('Video', VideoSchema);
export default Video
