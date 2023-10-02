import { useEffect, useRef, useState } from "react";
import { VscAccount } from "react-icons/vsc"
import "./styles.css";
import { config, timeformat } from "../../shared";
import axios from "axios";
import { Link } from "react-router-dom";

export default function VideoListElement({video, showOwner}) {
  const [channel, setChannel] = useState(null);
  const [duration, setDuration] =  useState("");

  useEffect(()=> {
    const getChannel = async () => {
      try {
        const res = await axios.get(`${config.backendUrl}/channels/${video.channel}`);
        setChannel(res.data);
      }
      catch (err) {
        console.log(err);
      }
    };
    getChannel();
  }, []);

  return (
    <div className="big-video-element">
      <Link className="thumbnail-container" to={`/watch/${video._id}`}>
        {video.thumbnail && <img className="thumbnail" src={`${config.backendUrl}/${video.thumbnail}`} alt="thumbnail"/>}
        <video style={video.thumbnail && {display: 'none'}} className="thumbnail" src={`${config.backendUrl}/${video.videoUrl}`}
        onLoadedMetadata={(e)=>{
          let duration = e.target.duration;
          let hours = Math.floor(duration / 3600);
          let minutes = Math.floor((duration % 3600) / 60);
          let seconds = Math.floor(duration % 60);
          if (hours < 10) { hours = '0' + hours; }
          if (minutes < 10) { minutes = '0' + minutes; }
          if (seconds < 10) { seconds = '0' + seconds; }
          setDuration((hours > 0 ? hours + ':' : '')+ minutes+':'+seconds)
        }}></video>
        <label className="thumbnail-duration">{duration}</label>
      </Link>
      <div className="big-video-header">
        <div className="channel-element">
          {channel?.avatar ?
            <img className="channel-icon" src={`${config.backendUrl}/${channel?.avatar}`} alt="ava"/> : 
            <VscAccount className="channel-icon"/>
          }
        </div>
        <div className="big-video-data">
          <Link to={`/watch/${video._id}`}>{video.title}</Link>
          {showOwner && <Link to={`/channel/${channel?._id}`}><span>{channel?.name}</span></Link>}
          <div className="video-views-date">
            <span>{video.views} views</span>
            <span>•</span>
            <span>{timeformat(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}