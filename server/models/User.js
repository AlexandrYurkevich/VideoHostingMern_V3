import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const userSchema = mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        language: String,
        notifications: { type: Boolean, default: true },
        sex: Boolean,
        res_mail: String,
        birthdate: Date,
    },{ timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User
