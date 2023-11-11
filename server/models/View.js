import mongoose from 'mongoose'

const ViewSchema = mongoose.Schema(
{
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video',required:true },
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel',required:true }
},{ timestamps: true }
)
const View = mongoose.model('View', ViewSchema);
export default View
