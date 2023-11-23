import mongoose from 'mongoose'

const PlaylistSchema = mongoose.Schema(
{
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  playlist_name: String,
  type: {type: number, default: 0 }
},{ timestamps: true }
)
const Playlist = mongoose.model('Playlist', PlaylistSchema);
export default Playlist
