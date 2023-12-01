import "./styles.css";
import { config, durationFormat, timeformat } from "../../shared";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

export default function NextPlaylistElement({video, showSelect, playlist, playlist_order}) {
  return (
    <div className="next-playlist-element" style={showSelect ? { background: "#ff366f"} : {}}>
      <Link className="next-playlist-container" to={`/watch/${video._id}/${playlist}/${playlist_order}`} >
        <img className="next-playlist-thumbnail" src={`${config.backendUrl}/${video.thumbnail_url}`} alt="thumbnail"/>
        <label className="thumbnail-duration">{durationFormat(video.duration)}</label>
      </Link>
      <div className="next-video-data">
        <Link to={`/watch/${video._id}/${playlist}/${playlist_order}`}><Typography noWrap maxWidth={"400px"}>{video.title}</Typography></Link>
        <Link to={`/channel/${video.channel._id}`}><span>{video.channel.channel_name}</span></Link>
        <span>{timeformat(video.createdAt)}</span>
      </div>
    </div>
  );
}