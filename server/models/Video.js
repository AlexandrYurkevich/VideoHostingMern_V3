import mongoose from 'mongoose'

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
  
const Video = mongoose.model('Video', VideoSchema);
export default Video
