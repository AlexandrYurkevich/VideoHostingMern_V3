import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const notifiationSchema = mongoose.Schema(
    {
        channel_id: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
        text: String,//Universal
        video_id: { type: Schema.Types.ObjectId, ref: 'Video' },
        comment_id: { type: Schema.Types.ObjectId, ref: 'Comment' },
        is_readed: {type: Boolean, default: false }
    },{ timestamps: true }
)

const Notification = mongoose.model('Notification', notifiationSchema)
export default Notification
