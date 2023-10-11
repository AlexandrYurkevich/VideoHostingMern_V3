import mongoose from 'mongoose'

const CommentSchema = mongoose.Schema(
{
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  text: String
},{ timestamps: true }
)
const Comment = mongoose.model('Comment', CommentSchema);
export default Comment
