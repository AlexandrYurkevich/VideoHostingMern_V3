import express from 'express';
import Playlist from '../models/Playlist.js';
import Video_Playlist from '../models/Video_Playlist.js';
import Video from '../models/Video.js';
const router = express.Router();

export const getPlaylist = async (req,res)=>{
  try {
    const playlist = await Playlist.findById(req.params.playlist_id).populate({path: 'start_video', populate:{path:'video_id'}}).populate('videos_count');
    res.status(200).json(playlist);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const getPlaylistsVideos = async (req,res)=>{
  try {
    const { playlist_id, offset } = req.query
    const videos = await Video_Playlist.find({playlist_id}).skip(offset).limit(20).populate({ path: 'video_id', populate: { path: 'channel' } });
    res.status(200).json(videos.map(v=> v.video_id));
  }
  catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getPlaylistsVideoIds = async (req,res)=>{
  try {
    const { playlist_id, offset } = req.query
    const videos = await Video_Playlist.distinct('video_id', {playlist_id}).skip(offset).limit(20);
    res.status(200).json(videos);
  }
  catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getPlaylistsByChannel = async (req,res)=>{
    try {
      const { channel_id, offset } = req.query
      const playlists = await Playlist.find({channel_id}).sort({createdAt: -1}).skip(offset).limit(20).populate({path: 'start_video', populate:{path:'video_id'}}).populate('videos_count');
      res.status(200).json(playlists);
    }
    catch (error) {
      res.status(404).json({ message: error.message })
    }
}

export const deletePlaylist = async (req,res)=>{
  try {
    const deleted = await Playlist.findByIdAndDelete(req.params.playlist_id);
    res.status(200).json(deleted);
  }
  catch (error) { res.status(404).json({ message: error.message }) }
}

export const addPlaylist = async (req,res)=>{
  try {
    const {playlist_name, playlist_desc, access_status, channel_id, start_videos} = req.body;
    const playlist = await Playlist.create({playlist_name, playlist_desc, access_status, channel_id});
    const videoPlaylists = start_videos.map((video_id) => ({ playlist_id: playlist._id, video_id }));
    await Video_Playlist.create(videoPlaylists);
    console.log(videoPlaylists)
    res.status(201).json({...playlist._doc, videos_count: videoPlaylists.length});
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const addVideosToPlaylist = async (req,res)=>{
  try {
    const {playlist_id, add_videos} = req.body;
    const videoPlaylists = add_videos.map((video_id) => ({ playlist_id, video_id }));
    await VideoPlaylist.create(videoPlaylists);
    res.status(201).json(videoPlaylists.length);
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export default router;