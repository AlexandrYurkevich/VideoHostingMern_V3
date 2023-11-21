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
import videoService from "../../services/VideoService";
import channelService from "../../services/ChannelService";
import subscribeService from "../../services/SubscribeService";

export default function Channel() {
  const { channel_id } = useParams();
  const navigate = useNavigate();
  const { user, channel } = useContext(AuthContext);
  const [subscribersCount, setSubscribersCount] = useState();
  const [videosCount, setVideosCount] = useState();
  const [isSubscribed, setIsSubscribed] = useState();

  const { formHidden, setFormHidden, editHidden, setEditHidden, 
    channelPage, setChannelPage, videoList, setVideoList } = useContext(ChannelContext);

  const onEndPage = () => {
    videoService.getVideosByChannel(channel_id, videoList.length)
    .then(res => { setVideoList([...videoList, ...res.videos]); })
    .catch (err => { console.log(err.message); })
  };

  useEffect(() => {
    channelService.getChannel(channel_id).then(res => {
      setChannelPage(res.channel);
      subscribeService.getSubscribersCount(channel_id).then(res=> setSubscribersCount(res.count));
      videoService.getVideosCount(channel_id).then(res => setVideosCount(res.count));
      videoService.getVideosByChannel(channel_id, 0).then(res => {
        setVideoList(res.videos);
      })
    }).catch(err=> console.log(err.message))
  }, [channel_id]);

  useEffect(()=>{ channel && subscribeService.isSubscribed(channel_id, channel?._id).then(res=> setIsSubscribed(res.result)); }, [channel])

  return (
    <div className="main-container">
      {formHidden && <UploadForm/>}
      {editHidden && <ChannelForm/>}
      <HeaderProvider><Header/></HeaderProvider>
      <div className="channel-container" onScroll={(e)=>{
        (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) && onEndPage()
      }}>
        {channelPage?.header && <img className="channel-banner" src= {`${config.backendUrl}/${channelPage?.header}`}/>}
        <div className="channel-main">
          <div style={{ display: "flex", gap: 10 }}>
            {channelPage?.avatar ? 
              <img className="channel-icon-big" src={`${config.backendUrl}/${channelPage?.avatar}`} alt="icon" /> :
              <VscAccount className="channel-icon-big"/>
            }
            <div className="channel-data">
              <label className="channel-name">{channelPage?.channel_name}</label>
              <div style={{ display: "flex", gap: 5 }}>
                <span>@{channel_id}</span>
                <span>{subscribersCount} subcribers</span>
                <span>{videosCount} videos</span>
              </div>
              <span style={{ wordWrap: "break-word" }}>
                {channelPage?.description}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {
              !user || channelPage?.user_id != user._id
              ?
              isSubscribed ?
              <button className="subscribe-button" style={{ background: "black" }}>Subscribed</button>
              :
              <button className="subscribe-button">Subscribe</button>
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
            return <VideoListElement video={video} showOwner={false}/>;
          })}
        </div>
    </div>
  </div>
  );
}