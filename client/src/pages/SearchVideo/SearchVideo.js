import "./styles.css";
import { config } from "../../shared"
import Header from "../../components/Header/Header"
import GanreBar from "../../components/GanreBar/GanreBar"
import NextVideoElement from "../../components/NextVideoElement/NextVideoElement";
import { HeaderProvider } from "../../contexts/HeaderContext";

import { TagContext } from "../../contexts/TagContext";
import { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import videoService from "../../services/VideoService";
import { AuthContext } from "../../contexts/AuthContext";


export default function SearchVideo() {
  const location = useLocation()
  const { user, channel } = useContext(AuthContext);
  const { selectedTagType, selectedTagValue } = useContext(TagContext);
  const [videoList, setVideoList] = useState([]);
  
  useEffect(() => {
    videoService.getSearch(location.state.pattern, 0, channel?._id, Math.floor((Date.now() - user?.birthdate)/31556952000)).then(res=> setVideoList(res.videos))
  }, [location.state]);

  return (
    <div className="main-container">
      <Header/>
      <div className="video-list" onScroll={(e)=>{
        if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight -1) {
          videoService.getSearch(location.state.pattern, videoList.length, channel?._id, Math.floor((Date.now() - user?.birthdate)/31556952000))
          .then(res=> setVideoList([...videoList, res.videos]));
        }
      }}>
        {videoList.map(video =>{ return <NextVideoElement video={video} showDesc={true}/> })}
      </div>
    </div>
  );
}