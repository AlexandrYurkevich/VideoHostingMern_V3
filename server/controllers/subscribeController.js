import Video from "../models/Subscribe.js"
import express from 'express';
import Subscribe from "../models/Subscribe.js";

const router = express.Router();

export const getIsSubscribed = async (req, res) => {
  try {
    const result = await Subscribe.findOne({subscribed_channel_id: req.query.sub_channel_id, subscriber_id: req.query.who});
    res.status(200).json(result);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}
export const addSubscribe = async (req, res) => {
  try {
    const newSub = new Subscribe({subscribed_channel_id: req.body.channel_id, subscriber_id: req.body.who});
    const saved = await newSub.save();
    res.status(201).json(saved);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}
export const deleteSubscribe = async (req, res) => {
  try {
    const deleted = await Subscribe.findOneAndDelete({subscribed_channel_id: req.query.channel_id, subscriber_id: req.query.who});
    res.status(200).json(deleted);
  }
  catch (error) { res.status(404).json({ message: error.message })}
}

export default router;
