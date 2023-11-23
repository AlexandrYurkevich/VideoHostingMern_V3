import Channel from "../models/Channel.js";
import express from 'express';

const router = express.Router();

export const getChannel = async (req,res)=>{
    try {
        const channel = await Channel.findById(req.params.id);
        res.status(200).json(channel);
    }
    catch (error) { res.status(404).json({ message: error.message }) }
}

export const edit = async (req,res)=>{
    try {
        const update = await Channel.findByIdAndUpdate({_id: req.params.id},
        {$set:{
            channel_name: req.body.channel_name,
            channel_desc: req.body.channel_desc,
            avatar_url: req.body.avatar_url,
            header: req.body.header
        }},
        {new: true });
        res.status(200).json(update);
    } catch (error) { res.status(404).json({ message: error.message }) }
}

export const addRecommendedChannel = async (req, res) => {
    try{
        const update = await Channel.findByIdAndUpdate(req.body.channelId,
        { $push: { recommendedChannels: req.body.recId } },
        {new: true });
        res.status(200).json(update);
    } catch (err) { res.status(500).json({message: err.message}); }
}

export default router;
