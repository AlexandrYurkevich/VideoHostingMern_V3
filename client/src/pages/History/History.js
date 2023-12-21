import "./styles.css";
import { config } from "../../shared"
import Header from "../../components/Header/Header"
import GanreBar from "../../components/GanreBar/GanreBar"
import NextVideoElement from "../../components/NextVideoElement/NextVideoElement";
import { HeaderProvider } from "../../contexts/HeaderContext";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import videoService from "../../services/VideoService";


export default function History() {
  const { channel } = useContext(AuthContext);
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    videoService.getHistory(channel?._id, 0).then(res => {setVideoList(res.videos)})
  }, [channel]);

  return (
    <div className="main-container">
      <Header/>
      <div className="video-list" onScroll={(e)=>{
        (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight-2) && videoService.getHistory(channel._id, videoList.length).then(res => setVideoList([...videoList,res.videos]))
      }}>
        {videoList?.map(video =>{ return <NextVideoElement video={video} showDesc={true}/> })}
      </div>
    </div>
  );
}