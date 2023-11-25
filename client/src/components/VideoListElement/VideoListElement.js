import { useEffect, useRef, useState } from "react";
import { VscAccount } from "react-icons/vsc"
import "./styles.css";
import { config, timeformat } from "../../shared";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar"
import videoService from "../../services/VideoService";

export default function VideoListElement({video, showOwner}) {
  const [channel, setChannel] = useState(video.channel);
  const [viewsCount, setViewsCount] = useState(0);
  useEffect(()=>{ videoService.getViewsCount(video._id).then(res => setViewsCount(res.count)); },[])

  return (
    <div className="big-video-element">
      <Link className="thumbnail-container" to={`/watch/${video._id}`}>
        <img className="thumbnail" src={`${config.backendUrl}/${video.thumbnail_url}`} alt="thumbnail"/>
        <label className="thumbnail-duration">{video.duration}</label>
      </Link>
      <div className="big-video-header">
        <div className="channel-element">
          {channel?.avatar_url ?
            <Avatar alt="ava" src={`${config.backendUrl}/${channel?.avatar_url}`}/> : 
            <Avatar sx={{ bgcolor: channel.avatar_color }}>{channel?.name}</Avatar> 
          }
        </div>
        <div className="big-video-data">
          <Link to={`/watch/${video._id}`}>{video.title}</Link>
          {showOwner && <Link to={`/channel/${channel?._id}`}><span>{channel?.name}</span></Link>}
          <div className="video-views-date">
            <span>{viewsCount} views</span>
            <span>•</span>
            <span>{timeformat(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}