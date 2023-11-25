import "./styles.css";
import { config, timeformat } from "../../shared";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import videoService from "../../services/VideoService";

export default function NextVideoElement({video, showDesc}) {
  const [duration, setDuration] =  useState("");
  const [viewsCount, setViewsCount] = useState(0);
  useEffect(()=>{ videoService.getViewsCount(video._id).then(res => setViewsCount(res.count)); },[])

  return (
    <div className="next-video-element">
      <Link className="thumbnail-container" to={`/watch/${video._id}`} >
        <img className="next-video-thumbnail" src={`${config.backendUrl}/${video.thumbnail_url}`} alt="thumbnail"/>
        <label className="thumbnail-duration">{video.duration}</label>
      </Link>
      <div className="next-video-data">
        <Link to={`/watch/${video._id}`}>{video.title}</Link>
        <Link to={`/channel/${video.channel._id}`}><span>{video.channel.channel_name}</span></Link>
        <div className="video-views-date">
          <span>{viewsCount} views</span>
          <span>•</span>
          <span>{timeformat(video.createdAt)}</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>{video.tags?.map(tag =>{
          return <span>#{tag}</span>;
        })}</div>
        {showDesc && <label>{video.description}</label>}
      </div>
    </div>
  );
}