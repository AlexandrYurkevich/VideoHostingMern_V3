import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const channelSchema = mongoose.Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        banner_url: String,
        avatar_url: String,
        avatar_color: String,
        channel_name: { type: String, required: true, unique: true },
        channel_desc: String,
        watch_later_playlist_id: { type: Schema.Types.ObjectId, ref: 'Playlist' }
    },{ timestamps: true, toJSON: { virtuals: true } }
)
channelSchema.virtual('subs_count', {
  ref: 'Subscribe',
  localField: '_id',
  foreignField: 'subscribed_channel_id',
  count: true
});
channelSchema.virtual('videos_count', {
  ref: 'Video',
  localField: '_id',
  foreignField: 'channel_id',
  count: true
});

const Channel = mongoose.model('Channel', channelSchema)
export default Channel
