import Header from "../../components/Header/Header";
import NextVideoElement from "../../components/NextVideoElement/NextVideoElement";
import "./styles.css";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import videoService from "../../services/VideoService";


export default function SearchVideo() {
  const location = useLocation()
  const { user, channel } = useContext(AuthContext);
  const [videoList, setVideoList] = useState([]);
  
  useEffect(() => {
    videoService.getSearch(location.state.pattern, 0, channel?._id, Math.floor((Date.now() - user?.birthdate)/31556952000)).then(res=> setVideoList(res.videos))
  }, [location.state, channel?._id, user?.birthdate]);

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