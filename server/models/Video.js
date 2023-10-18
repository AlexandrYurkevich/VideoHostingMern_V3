import mongoose from 'mongoose'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

const VideoSchema = mongoose.Schema(
  {
    channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
    title: String,
    description: String,
    duration: Number,
    videoUrl: String,
    thumbnailUrl: String,
    tags: [String]
  },
  { timestamps: true }
);
VideoSchema.pre("findByIdAndDelete", (video)=>{
  fs.unlinkSync(`${__dirname}'\\public\\${video.videoUrl}`)
  video.thumbnail && fs.unlinkSync(`${__dirname}'\\public\\${video.thumbnailUrl}`)
  //del comments, video_paylists, likes, watchhstory?, subscribes
})
  
const Video = mongoose.model('Video', VideoSchema);
export default Video
