import Video from "../models/Subscribe.js"
import express from 'express';
import Subscribe from "../models/Subscribe.js";
import Notification from "../models/Notification.js";

const router = express.Router();

export const getIsSubscribed = async (req, res) => {
  try {
    console.log("Subs is - " +  req.query.sub_channel_id +"  - "+ req.query.who)
    const result = await Subscribe.findOne({subscribed_channel_id: req.query.sub_channel_id, subscriber_id: req.query.who});
    console.log("is_sub - " + result)
    res.status(200).json(result);
  }
  catch (error) { console.log(error)}
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

export const addNotifications = async (req, res) => {
  try {
    const subscribers = await Subscribe.distinct('subscriber_id', { subscribed_channel_id: req.body.channel_id });
    subscribers.forEach(sub => {
      Notification.create({channel_id:sub, video_id: req.body.video_id})
    });
    res.status(201).json(saved);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const deleteNotifications = async (req, res) => {
  try {
    const deleted = Notification.deleteMany({channel_id: req.query.channel_id, is_readed: true});
    res.status(201).json(saved);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}
export const getNotifications = async (req, res) => {
  try {
    const noti = Notification.find({channel_id: req.query.channel_id});
    res.status(201).json(noti);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}
export const readNotification = async (req, res) => {
  try {
    const readed = Notification.findOneAndUpdate({_id: req.body.noti_id}, {$set: {is_readed: true}});
    res.status(201).json(readed);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export default router;
