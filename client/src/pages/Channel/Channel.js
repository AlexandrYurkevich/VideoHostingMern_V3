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
import { Button, Avatar, Dialog, DialogContent, DialogTitle, Tab, Tabs, Typography, TextField } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlaylistListElement from "../../components/VideoListElement/PlaylistListElement";
import playlistService from "../../services/PlaylistService";

export default function Channel() {
  const { channel_id } = useParams();
  const navigate = useNavigate();
  const { user, channel } = useContext(AuthContext);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [channelPage, setChannelPage] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [playlistList, setPlaylistList] = useState([]);
  const [fullDescOpen, setFullDescOpen] = useState(false);

  const onTrySubscribe = () =>{
    if(!channel) { navigate("/login"); return; }
    isSubscribed ? subscribeService.removeSubscribe(channel_id, channel._id).then(res=> setIsSubscribed(false)): subscribeService.addSubscribe(channel_id, channel._id).then(res=> setIsSubscribed(true))
  }

  const onEndPage = () => {
    switch (currentTab) {
      case 1:
        videoService.getVideosByChannel(channel_id, videoList.length).then(res => { setVideoList([...videoList, ...res.videos]); })
    .catch (err => { console.log(err.message); })
        break;
      case 2:
        playlistService.getPlaylistsByChannel(channel_id, playlistList.length).then(res => { setPlaylistList([...playlistList, ...res.playlists]); })
    .catch (err => { console.log(err.message); })
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    channelService.getChannel(channel_id).then(res => {
      setChannelPage(res.channel);
      videoService.getVideosByChannel(channel_id, 0).then(res => { setVideoList(res.videos); })
      playlistService.getPlaylistsByChannel(channel_id, 0).then(res => { setPlaylistList([...playlistList, ...res.playlists]); })
    }).catch(err=> console.log(err.message))
  }, [channel_id]);

  useEffect(()=>{ channel && subscribeService.isSubscribed(channel_id, channel?._id).then(res=> setIsSubscribed(res.result)); }, [channel])

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
      <Dialog open={fullDescOpen} onClose={()=>setFullDescOpen(false)} maxWidth="100vw">
        <DialogTitle>Full description</DialogTitle>
        <DialogContent sx={{ wordWrap: 'break-word', whiteSpace: 'pre-line' }}>{channelPage?.channel_desc}</DialogContent>
      </Dialog>
    </div>)}

  return (
    <div className="main-container">
      <HeaderProvider><Header/></HeaderProvider>
      <div className="channel-container" onScroll={(e)=>{
        (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) && onEndPage()
      }}>
        {channelPage?.banner_url && <img className="channel-banner" src= {`${config.backendUrl}/${channelPage?.banner_url}`}/>}
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
                <span>{channelPage?.subs_count} subcribers</span>
                <span>{channelPage?.videos_count} videos</span>
              </div>
              <ChannelDesciptionComponent/>
              {
                channel_id != channel?._id
                ?
                <Button variant="contained" color="secondary" sx={{width:"50%",borderRadius:'50px', color:"white",background: isSubscribed ? "black": "red"}}
                onClick={()=>onTrySubscribe()}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}</Button>
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
          {currentTab == 1 ? videoList.map(video =>{
            return <VideoListElement key={video._id} video={video} showOwner={false}/>;
          }) :
          playlistList.map(playlist =>{
            return <PlaylistListElement key={playlist._id} video={playlist.start_video.video_id} playlist={playlist} playlist_order={0}/>;
          })
          }
        </div>
    </div>
  </div>
  );
}