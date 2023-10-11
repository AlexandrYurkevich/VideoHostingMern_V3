import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const channelSchema = mongoose.Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User',required: true },
        header: String,
        avatar: String,
        channel_name: { type: String, required: true,unique: true },
        channel_description:String,
        recommended_channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }]
    },{ timestamps: true }
)

const Channel = mongoose.model('Channel', channelSchema)
export default Channel
