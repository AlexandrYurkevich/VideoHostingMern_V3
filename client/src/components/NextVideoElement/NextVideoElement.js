import { Card, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { config, durationFormat, timeformat } from "../../shared";
import "./styles.css";

export default function NextVideoElement({video, showDesc}) {
  return (
    <Card className="next-video-element">
      <Link className="next-thumbnail-container" to={`/watch/${video._id}`} >
        <img className="next-video-thumbnail" src={`${config.backendUrl}/${video.thumbnail_url}`} alt="thumbnail"/>
        <label className="thumbnail-duration">{durationFormat(video.duration)}</label>
      </Link>
      <div className="next-video-data">
        <Link to={`/watch/${video._id}`}><Typography noWrap maxWidth={"400px"}>{video.title}</Typography></Link>
        <Link to={`/channel/${video.channel._id}`}><span>{video.channel.channel_name}</span></Link>
        <div className="video-views-date">
          <span>{video.views_count} views</span>
          <span>•</span>
          <span>{timeformat(video.createdAt)}</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>{video.tags?.map(tag =>{
          return <span>#{tag}</span>;
        })}</div>
        {showDesc && <label>{video.description}</label>}
      </div>
    </Card>
  );
}