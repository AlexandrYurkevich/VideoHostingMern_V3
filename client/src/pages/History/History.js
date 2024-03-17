import Header from "../../components/Header/Header";
import NextVideoElement from "../../components/NextVideoElement/NextVideoElement";
import "./styles.css";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
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