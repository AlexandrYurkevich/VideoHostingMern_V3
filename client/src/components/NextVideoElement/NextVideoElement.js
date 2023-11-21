import "./styles.css";
import { config, timeformat } from "../../shared";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NextVideoElement({video, showDesc}) {
  const [duration, setDuration] =  useState("");

  return (
    <div className="next-video-element">
      <Link className="thumbnail-container" to={`/watch/${video._id}`} >
        {video.thumbnail && <img className="next-video-thumbnail" src={`${config.backendUrl}/${video.thumbnail}`} alt="thumbnail"/>}
        <video style={video.thumbnail && {display: 'none'}} className="next-video-thumbnail" src={`${config.backendUrl}/${video.videoUrl}`}>
          <label className="thumbnail-duration">{video.duration}</label>
        </video>
      </Link>
      <div className="next-video-data">
        <Link to={`/watch/${video._id}`}>{video.title}</Link>
        <Link to={`/channel/${video.channel._id}`}><span>{video.channel.name}</span></Link>
        <div className="video-views-date">
          <span>{video.views} views</span>
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