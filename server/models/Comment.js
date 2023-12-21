import mongoose from 'mongoose'

const CommentSchema = mongoose.Schema(
{
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  text: String
},{ timestamps: true, toJSON: { virtuals: true } }
)
CommentSchema.virtual('channel', {
  ref: 'Channel',
  localField: 'channel_id',
  foreignField: '_id',
  justOne: true
});
CommentSchema.virtual('answers_count', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent_id',
  count: true
});
CommentSchema.virtual('likes_count', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'comment_id',
  count: true,
  $match: { is_dislike: false }
});
CommentSchema.virtual('dislikes_count', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'comment_id',
  count: true,
  $match: { is_dislike: true }
});
CommentSchema.pre('findOneAndDelete', async function (next) {
  const сomment = await this.model.findOne(this.getQuery());
  if (!сomment) { return next(); }
  try {
    await Comment.deleteMany({ parent_id: сomment._id });
    await Like.deleteMany({ comment_id: сomment._id });
    next();
  } catch (error) { return next(error); }
});

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment
