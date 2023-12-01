import { useEffect, useRef, useState } from "react";
import { VscAccount } from "react-icons/vsc"
import "./styles.css";
import { config, durationFormat, timeformat } from "../../shared";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar"
import videoService from "../../services/VideoService";
import { Typography } from "@mui/material";

export default function VideoListElement({video, showOwner}) {
  return (
    <div className="big-video-element">
      <Link className="thumbnail-container" to={`/watch/${video._id}`}>
        <img className="thumbnail" loading="lazy" src={`${config.backendUrl}/${video.thumbnail_url}`} alt="thumbnail"/>
        <label className="thumbnail-duration">{durationFormat(video.duration)}</label>
      </Link>
      {video.access_status!=3&& <label style={{background:'lightgrey'}}>Ограниченный доступ</label>}
      <div className="big-video-header">
        <div className="channel-element">
          {video.channel.avatar_url ?
            <Avatar alt="ava" src={`${config.backendUrl}/${video.channel.avatar_url}`}/> : 
            <Avatar sx={{ bgcolor: video.channel.avatar_color }}>{video.channel.channel_name.charAt(0).toUpperCase()}</Avatar> 
          }
        </div>
        <div className="big-video-data">
          <Link to={`/watch/${video._id}`}><Typography noWrap maxWidth={"300px"}>{video.title}</Typography></Link>
          {showOwner && <Link to={`/channel/${video.channel._id}`}><span>{video.channel.channel_name}</span></Link>}
          <div className="video-views-date">
            <span>{video.views_count} views</span>
            <span>•</span>
            <span>{timeformat(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}