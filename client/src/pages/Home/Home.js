import "./styles.css";
import Header from "../../components/Header/Header"
import GanreBar from "../../components/GanreBar/GanreBar"
import VideoListElement from "../../components/VideoListElement/VideoListElement";
import { useState, useEffect, useContext } from "react";
import videoService from "../../services/VideoService";
import { AuthContext } from "../../contexts/AuthContext";


export default function Home() {
  const { user, channel } = useContext(AuthContext);
  const [selected_tags, setSelectedTags] = useState([]);
  const [videoList, setVideoList] = useState([]);

  const onEndPage = () => {
    videoService.getVideos({by_recommend: channel?._id},{by_date:-1}, videoList.length).then(res=>setVideoList([...videoList, ...res.videos])).catch(err => console.log(err.message));
  };

  const reloadVideos = () => {
    videoService.getVideos({by_recommend: channel?._id},{by_date:-1}, 0).then(res=>setVideoList(res.videos)).catch(err => console.log(err.message));
  };

  useEffect(()=> reloadVideos(), [selected_tags]);
  useEffect(() => reloadVideos(), [channel]);

  return (
    <div className="main-container">
      <Header/>
      <GanreBar/>
      <div className="video-grid" onScroll={(e)=>{
        (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight-2) && onEndPage()
      }}>
        {videoList.map(video =>{ return <VideoListElement key={video._id} video={video} showOwner={true}/> })}
      </div>
    </div>
  );
}