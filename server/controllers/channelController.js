import Channel from "../models/Channel.js";
import Subscribe from "../models/Subscribe.js";
import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

const router = express.Router();

export const getChannel = async (req,res)=>{
    try {
        const channel = await Channel.findById(req.params.channel_id).populate("subs_count videos_count");
        res.status(200).json(channel);
    }
    catch (error) { res.status(404).json({ message: error.message }) }
}

export const deleteChannel = async (req,res)=>{
  try {
    const deleted = await Channel.findByIdAndDelete(req.params.channel_id);
    res.status(200).json(deleted);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getRecommendedChannels = async (req,res)=>{
    try {
        const channels = await Channel.findById(req.params.channel_id).select({recommended_channels}).populate('recommended_channels');
        res.status(200).json(channels);
    }
    catch (error) { res.status(404).json({ message: error.message }) }
}

export const addRecommendedChannel = async (req, res) => {
    try{
        const update = await Channel.findByIdAndUpdate(req.params.channel_id,
        { $push: { recommendedChannels: req.body.recommended_id } },
        {new: true });
        res.status(200).json(update);
    } catch (err) { res.status(500).json({message: err.message}); }
}

export const removeRecommendedChannel = async (req,res)=>{
  try {
    const update = await Channel.findByIdAndUpdate(req.params.channel_id,
        { $pull: { recommendedChannels: req.body.recommended_id } },
        {new: true });
    res.status(200).json(update);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const editChannel = async (req,res)=>{
    try {
        const update = await Channel.findByIdAndUpdate(req.params.channel_id,
        {$set:{
            channel_name: req.body.channel_name,
            channel_desc: req.body.channel_desc
        }},
        {new: true });
        res.status(200).json(update);
    } catch (error) { res.status(404).json({ message: error.message }) }
}

export const editAvatar = async (req,res)=>{
    try {
        const old = await Channel.findByIdAndUpdate(req.params.channel_id,
        {$set:{ avatar_url: req.body.new_url} });
        console.log("edit avatar - " + old + " url - " + req.body.new_url)
        old.avatar_url && fs.unlinkSync(`${__dirname}\\public\\${old.avatar_url}`)
        res.status(200).json(old);
    } catch (error) { res.status(404).json({ message: error.message }) }
}
export const editBanner = async (req,res)=>{
    try {
        const old = await Channel.findByIdAndUpdate(req.params.channel_id,
        {$set:{ banner_url: req.body.new_url} });
        old.avatar_url && fs.unlinkSync(`${__dirname}\\public\\${old.banner_url}`)
        res.status(200).json(old);
    } catch (error) { res.status(404).json({ message: error.message }) }
}

export default router;
