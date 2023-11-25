import Header from "../../components/Header/Header"
import { HeaderProvider } from "../../contexts/HeaderContext";
import VideoListElement from "../../components/VideoListElement/VideoListElement";
import "./styles.css";
import { config } from "../../shared"
import { AuthContext } from "../../contexts/AuthContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import videoService from "../../services/VideoService";
import channelService from "../../services/ChannelService";
import subscribeService from "../../services/SubscribeService";
import { Button, Avatar, Dialog, DialogContent, DialogTitle, Tab, Tabs, Typography } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Channel() {
  const { channel_id } = useParams();
  const navigate = useNavigate();
  const { user, channel } = useContext(AuthContext);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [channelPage, setChannelPage] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [fullDescOpen, setFullDescOpen] = useState(false);

  const ChannelDesciptionComponent = ()=> {
    if(!channelPage?.channel_desc) return(<Typography variant="body1">Похоже у канала ещё нет описания.</Typography>)
    let newLineIndex = channelPage?.channel_desc.indexOf("\n");
    let isToMuch = channelPage?.channel_desc.length > 64 || newLineIndex != -1;
    return(<div>
      <Typography variant="body1">
        {isToMuch
          ? `${channelPage?.channel_desc.substring(0, 64).substring(0, newLineIndex !=-1 ? newLineIndex : channelPage?.channel_desc.length)}...`
          : channelPage?.channel_desc}
        {isToMuch && <ArrowForwardIosIcon onClick={()=>setFullDescOpen(true)} fontSize="small"/>}
      </Typography>
      <Dialog open={fullDescOpen} onClose={()=>setFullDescOpen(false)}>
        <DialogTitle>Full description</DialogTitle>
        <DialogContent>{channelPage?.channel_desc}</DialogContent>
      </Dialog>
    </div>)}

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
      <HeaderProvider><Header/></HeaderProvider>
      <div className="channel-container" onScroll={(e)=>{
        (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) && onEndPage()
      }}>
        {channelPage?.header && <img className="channel-banner" src= {`${config.backendUrl}/${channelPage?.header}`}/>}
        <div className="channel-main">
          <div style={{ display: "flex", gap: 10 }}>
            {channelPage?.avatar_url ? 
              <Avatar sx={{ width: 160, height: 160 }} alt="ava" src={`${config.backendUrl}/${channelPage?.avatar_url}`}/> : 
              <Avatar sx={{ bgcolor: channelPage?.avatar_color,width: 160, height: 160,fontSize: '80px' }}>{channelPage?.channel_name.charAt(0).toUpperCase()}</Avatar> 
            }
            <div className="channel-data">
              <Typography variant="h4">{channelPage?.channel_name}</Typography>
              <div style={{ display: "flex", gap: 5 }}>
                <span>@{channel_id}</span>
                <span>{subscribersCount} subcribers</span>
                <span>{videosCount} videos</span>
              </div>
              <ChannelDesciptionComponent/>
              {
                !user || channelPage?.user_id != user._id
                ?
                <button className="subscribe-button" style={{background: isSubscribed ? "black": "red"}}>{isSubscribed ? "Subscribed" : "Subscribe"}</button>
                :
                <div style={{ display: "flex", gap: 5 }}>
                  <Link to = "/studio/editing"><Button variant="contained" color="secondary" sx={{borderRadius:'50px'}}>Edit Channel View</Button></Link>
                  <Link to = "/studio/videos"><Button variant="contained" color="secondary" sx={{borderRadius:'50px'}}>Manage Videos</Button></Link>
                </div>
              }
            </div>
          </div>
        </div>
        <Tabs value={currentTab} onChange={(event, newValue) => {setCurrentTab(newValue)}} aria-label="channel tabs">
          <Tab label="Main" />
          <Tab label="Videos"/>
          <Tab label="Playlists"/>
        </Tabs>
        <div className="channel-body">
          {videoList.map(video =>{
            return <VideoListElement video={video} showOwner={false}/>;
          })}
        </div>
    </div>
  </div>
  );
}