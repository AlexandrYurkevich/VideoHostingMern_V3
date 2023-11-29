import mongoose from 'mongoose'

const PlaylistSchema = mongoose.Schema(
{
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  playlist_name: String,
  playlist_desc: String,
  access_status: Number,
  type: {type: number, default: 0 } //0 - common, 1- jam
},{ timestamps: true }
)
PlaylistSchema.virtual('videos_count', {
  ref: 'Video_Playlist',
  localField: '_id',
  foreignField: 'playlist_id',
  count: true
});
const Playlist = mongoose.model('Playlist', PlaylistSchema);
export default Playlist
