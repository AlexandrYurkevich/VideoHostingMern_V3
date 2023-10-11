import mongoose from 'mongoose'

const WatchHistorySchema = mongoose.Schema(
{
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  watched_video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true }
},{ timestamps: true }
)
const WatchHistory = mongoose.model('WatchHistory', WatchHistorySchema);
export default WatchHistory
