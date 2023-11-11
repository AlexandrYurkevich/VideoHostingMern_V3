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


export default function SearchVideo() {
  const location = useLocation()
  const { selectedTagType, selectedTagValue } = useContext(TagContext);
  const [videoList, setVideoList] = useState([]);

  const onEndPage = async () => {
    try {
      const res = await axios.get(`${config.backendUrl}/search`
      ,{
        params: {
          search_pattern: location.state.pattern,
          index: videoList.length,
          filter: {
            by_date: "",
            by_type: "",
            by_durartion: "",
            by_tag: ""
          },
          sort: {
            by_date: "",
            by_like_ratio: "",
            by_views: ""
          }
        }
      });
      setVideoList([...videoList, ...res.data]);
    }
    catch (err) {
      console.log(err.response.data.message);
    }
  };

  const getVideosSearch = async () => {
    try {
      const res = await axios.get(`${config.backendUrl}/videos/search`
      ,{
        params: {
          pattern: location.state.pattern,
          index: 0,
          stype: selectedTagType,
          svalue: selectedTagValue
        }
      });
      setVideoList(res.data);
    } catch (err) {
      console.log(err.response.data.message);
      setVideoList([]);
    }
  };
  
  useEffect(()=>{ getVideosSearch(); }, [selectedTagType, selectedTagValue]);

  useEffect(() => {
    getVideosSearch();
  }, [location.state]);

  return (
    <div className="main-container">
      <HeaderProvider><Header/></HeaderProvider>
      <GanreBar title={"Results of search for '"+location.state.pattern+"'"}/>
      <div className="video-list" onScroll={(e)=>{
        if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight -1) {
          onEndPage();
        }
      }}>
        {videoList.map(video =>{ return <NextVideoElement video={video} showDesc={true}/> })}
      </div>
    </div>
  );
}