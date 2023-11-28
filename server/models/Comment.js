import mongoose from 'mongoose'

const CommentSchema = mongoose.Schema(
{
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  text: String
},{ timestamps: true }
)
CommentSchema.virtual('channel', {
  ref: 'Channel',
  localField: 'channel_id',
  foreignField: '_id',
  justOne: true
});
CommentSchema.virtual('likes_count', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'comment_id',
  count: true,
  options: { $match: { is_dislike: false } }
});
CommentSchema.virtual('dislikes_count', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'comment_id',
  count: true,
  options: { $match: { is_dislike: true } }
});

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment
