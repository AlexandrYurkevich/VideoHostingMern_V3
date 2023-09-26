import "./styles.css";
import config from "../../config"
import Header from "../../components/Header/Header"
import GanreBar from "../../components/GanreBar/GanreBar"
import NextVideoElement from "../../components/NextVideoElement/NextVideoElement";
import { HeaderProvider } from "../../contexts/HeaderContext";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";


export default function History() {
  const { user } = useContext(AuthContext);
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    const getVideosHistory = async () => {
      try {
          const res = await axios.get(`${config.backendUrl}/videos/history/${user._id}/${videoList.length}`);
          setVideoList(res.data.history);
      }
      catch (err) {
          console.log(err.data);
      }
    };
    getVideosHistory();
  }, []);

  return (
    <div className="main-container">
      <HeaderProvider><Header/></HeaderProvider>
      <div className="video-list">
        {videoList?.map(video =>{ return <NextVideoElement video={video} showDesc={true}/> })}
      </div>
    </div>
  );
}