import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import Like from './Like.js';
import Comment from './Comment.js';
import Video from './Video.js';
import Playlist from './Playlist.js';
import Subscribe from './Subscribe.js';
import Notification from './Notification.js';

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
channelSchema.pre('findOneAndDelete', async function (next) {
  const channel = await this.model.findOne(this.getQuery());
  if (!channel) { return next(); }
  try {
    if (channel.avatar_url) {
      const avatarFilePath = `${__dirname}\\public\\${channel.avatar_url}`;
      fs.unlink(avatarFilePath, (err) => { if (err) { console.error(`Error deleting file: ${err}`); } });
    }
    if (channel.banner_url) {
      const bannerFilePath = `${__dirname}\\public${channel.banner_url}`;
      fs.unlink(bannerFilePath, (err) => { if (err) { console.error(`Error deleting file: ${err}`); } });
    }
    await Comment.deleteMany({ channel_id: channel._id });
    await Like.deleteMany({ channel_id: channel._id });
    await Video.deleteMany({ channel_id: channel._id });
    await Playlist.deleteMany({ channel_id: channel._id });
    await Notification.deleteMany({ channel_id: channel._id });
    await Subscribe.deleteMany({ $or:[{subscribed_channel_id: channel._id }, {subscriber_id: channel._id }]});
    next();
  } catch (error) { return next(error); }
});

const Channel = mongoose.model('Channel', channelSchema)
export default Channel
