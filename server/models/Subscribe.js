import mongoose from 'mongoose'

const SubscribeSchema = mongoose.Schema(
{
  subscribed_channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  subscriber_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  notifications: {type: Boolean, default: false }
},{ timestamps: true }
)
const Subscribe = mongoose.model('Subscribe', SubscribeSchema);
export default Subscribe
