import Header from "../../components/Header/Header"
import { HeaderProvider } from "../../contexts/HeaderContext";
import VideoListElement from "../../components/VideoListElement/VideoListElement";
import UploadForm from "../../components/UploadForm/UploadForm";
import ChannelForm from "../../components/ChannelForm/ChannelForm";
import { VscAccount } from "react-icons/vsc";
import "./styles.css";
import { config } from "../../shared"
import { AuthContext } from "../../contexts/AuthContext";
import { ChannelContext } from "../../contexts/ChannelContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import userService from "../../services/UserService";
import videoService from "../../services/VideoService";

export default function Channel() {
  const { id } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { formHidden, setFormHidden, editHidden, setEditHidden, 
    channelPage, setChannelPage, videoList, setVideoList } = useContext(ChannelContext);

  const onSubscribe = async ()=> {
    !user && navigate("/login");
    try{
      if(user.subscribedChannels?.includes(channelPage?._id)){
        const res = await axios.put(`${config.backendUrl}/users/unsubscribe`, {
          userId: user._id,
          channelId: channelPage?._id
        });
        setChannelPage(res.data.updatedChannel);
        setUser(res.data.updatedUser)
      }
      else{
        const res = await axios.put(`${config.backendUrl}/users/subscribe`, {
          userId: user._id,
          channelId: channelPage?._id
        });
        setChannelPage(res.data.updatedChannel);
        setUser(res.data.updatedUser)
      }
    }
    catch (err) {
      console.log(err.response.data.message);
    }
    // userService.subscribe(user._id, channelPage?._id)
  }

  const onEndPage = () => {
    videoService.getVideosByChannel(id, videoList.length)
    .then(res => {
      setVideoList([...videoList, ...res.videos]);
    })
    .catch (err => {
        console.log(err.message);
    })
  };

  useEffect(() => {
    const getChannel = async () => {
      try {
        console.log("channl effect")
        const channel = await axios.get(`${config.backendUrl}/channels/${id}`);
        setChannelPage(channel.data);
        videoService.getVideosByChannel(id, 0).then(res => setVideoList(res.videos))
      } catch (err) {
        console.log(err.response.data.message);
      }
    };
    getChannel();
  }, []);

  return (
    <div className="main-container">
      {formHidden && <UploadForm/>}
      {editHidden && <ChannelForm/>}
      <HeaderProvider><Header/></HeaderProvider>
      <div className="channel-container" onScroll={(e)=>{
        (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) && onEndPage()
      }}>
        {channelPage?.header ? 
          <img className="channel-header" src= {`${config.backendUrl}/${channelPage?.header}`}/> :
          <div className="channel-header"/>
        }
        <div className="channel-main">
          <div style={{ display: "flex", gap: 10 }}>
            {channelPage?.avatar ? 
              <img className="channel-icon-big" src={`${config.backendUrl}/${channelPage?.avatar}`} alt="icon" /> :
              <VscAccount className="channel-icon-big"/>
            }
            <div className="channel-data">
              <label className="channel-name">{channelPage?.name}</label>
              <div style={{ display: "flex", gap: 5 }}>
                <span>@{id}</span>
                <span>{channelPage?.subscribers.length} subcribers</span>
                <span>{channelPage?.videos.length} video</span>
              </div>
              <span style={{ wordWrap: "break-word" }}>
                {channelPage?.description}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {
              !user || channelPage?.user != user._id
              ?
              user?.subscribedChannels.includes(channelPage?._id) ?
              <button className="subscribe-button" style={{ background: "black" }} onClick={()=>onSubscribe()}>Subscribed</button>
              :
              <button className="subscribe-button" onClick={()=>onSubscribe()}>Subscribe</button>
              :
              <div>
                <button className="subscribe-button" style={{ background: "black" }} onClick={()=> setFormHidden(true)}>
                  Upload Video
                </button>
                <button className="subscribe-button" style={{ background: "black" }} onClick={()=> setEditHidden(true)}>
                  Edit Channel
                </button>
              </div>
            }
          </div>
        </div>
        <div className="channel-body">
          {videoList.map(video =>{
            return <VideoListElement key={video._id} video={video} showOwner={false}/>;
          })}
        </div>
    </div>
  </div>
  );
}