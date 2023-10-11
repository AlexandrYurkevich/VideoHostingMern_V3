import mongoose from 'mongoose'

const Video_PlaylistSchema = mongoose.Schema(
{
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', required: true }
},{ timestamps: true }
)
const Video_Playlist = mongoose.model('Video_Playlist', Video_PlaylistSchema);
export default Video_Playlist
