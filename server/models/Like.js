import mongoose from 'mongoose'

const LikeSchema = mongoose.Schema(
{
  comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel',required:true },
  is_dislike: Boolean
},{ timestamps: true }
)
const Like = mongoose.model('Like', LikeSchema);
export default Like
