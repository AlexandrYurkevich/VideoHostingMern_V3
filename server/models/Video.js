import mongoose from 'mongoose'
import fs from 'fs';
import View from "../models/View.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
    access_status: { type: Number, default: false }
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
VideoSchema.pre("findByIdAndDelete", (video)=>{
  fs.unlinkSync(`${__dirname}'\\public\\${video.video_url}`)
  video.thumbnail && fs.unlinkSync(`${__dirname}'\\public\\${video.thumbnail_url}`)
  //del comments, video_paylists, likes, watchhstory?, subscribes
})
  
const Video = mongoose.model('Video', VideoSchema);
export default Video
