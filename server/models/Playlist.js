import mongoose from 'mongoose'

const PlaylistSchema = mongoose.Schema(
{
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  playlist_name: String,
  playlist_desc: String,
  access_status: Number
},{ timestamps: true, toJSON: { virtuals: true } }
)
PlaylistSchema.virtual('videos_count', {
  ref: 'Video_Playlist',
  localField: '_id',
  foreignField: 'playlist_id',
  count: true
});
PlaylistSchema.virtual('start_video', {
  ref: 'Video_Playlist',
  localField: '_id',
  foreignField: 'playlist_id',
  justOne: true,
  sort: {createdAt: -1}
});
PlaylistSchema.pre('findOneAndDelete', async function (next) {
  const deletedPlaylist = await this.model.findOne(this.getQuery());
  if (!deletedPlaylist) { return next(); }
  try {
    await this.model('Video_Playlist').deleteMany({ playlist_id: deletedPlaylist._id });
    next();
  } catch (error) { return next(error); }
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);
export default Playlist
