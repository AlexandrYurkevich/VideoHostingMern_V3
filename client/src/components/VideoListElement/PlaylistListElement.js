import "./styles.css";
import { config, timeformat } from "../../shared";
import { Link } from "react-router-dom";
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { Typography } from "@mui/material";

export default function PlaylistListElement({video, playlist, playlist_order}) {
  return (
    <div className="big-video-element">
      <Link className="thumbnail-container" to={`/watch/${video?._id}/${playlist._id}/${playlist_order}`}>
        <div className="video-playlist"/>
        <img className="thumbnail" loading="lazy" src={`${config.backendUrl}/${video?.thumbnail_url}`}/>
        <label className="thumbnail-duration"><PlaylistPlayIcon fontSize="small"/>{playlist.videos_count} videos</label>
      </Link>
      {playlist.access_status!=3&& <label style={{background:'lightgrey'}}>Ограниченный доступ</label>}
      <Typography noWrap maxWidth={"300px"}>{playlist.playlist_name}</Typography>
      <span>{timeformat(playlist.createdAt)}</span>
    </div>
  );
}