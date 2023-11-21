import express from 'express';
import User from '../models/User.js'
import Channel from "../models/Channel.js";
import bcrypt from 'bcrypt'

const router = express.Router();
function getRandomColor() {
    var hexR = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    var hexG = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    var hexB = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return '#' + hexR + hexG + hexB;
}

export const Register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({ 
            email: req.body.email,
            password: hashedPassword,
            birthday: req.body.birthday
        });
        const user = await newUser.save();
        const newChannel = new Channel({
            channel_name: req.body.name,
            user_id: user._id,
            avatar_color: getRandomColor()
        });
        const channel = await newChannel.save();
        res.status(200).json({ user: user, channel: channel });
    } catch (err) { console.log(err); res.status(500).json({message: "User already exists"}) }
};
export const Login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match){
            return res.status(400).json({message: "Invalid password"})
        }
        const channel = await Channel.findOne({user_id: user._id})
        res.status(200).json({ user: user, channel: channel })
    } catch (err) {
        res.status(500).json({message: err.massage})
    }
};


export default router;
