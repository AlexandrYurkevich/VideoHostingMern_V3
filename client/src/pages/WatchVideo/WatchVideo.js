import { config,timeformat } from "../../shared";
import GanreBar from "../../components/GanreBar/GanreBar";
import Header from "../../components/Header/Header";
import Scroller from "../../components/Scroller/Scroller";
import {AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai"
import { Link } from "react-router-dom";
import "./styles.css";
import NextVideoElement from "../../components/NextVideoElement/NextVideoElement";
import { HeaderProvider } from "../../contexts/HeaderContext";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { TagContext } from "../../contexts/TagContext";
import videoService from "../../services/VideoService";
import subscribeService from "../../services/SubscribeService"
import CommentElement from "../../components/CommentElement/CommentElement";
import likeService from "../../services/LikeService";
import { Avatar, Button } from "@mui/material";
import commentService from "../../services/CommentService";

export default function WatchVideo() {
  const { video_id } = useParams();
  const { selected_tags, selectedTagValue } = useContext(TagContext);
  const { user, channel } =  useContext(AuthContext);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(0);
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();
  const [videoList, setVideoList] = useState([]);
  const [commentList, setCommentList] = useState([]);

  const onTrySubscribe = () =>{
    if(!channel) navigate("/login")
    isSubscribed ? subscribeService.removeSubscribe(video.channel_id, channel?._id).then(res=> setIsSubscribed(false)): subscribeService.addSubscribe(video.channel_id, channel?._id).then(res=> setIsSubscribed(true))
  }
  const onTryLike = () =>{
    if(!channel) navigate("/login")
    switch (isLiked) {
      case 1:
        likeService.removeLike(video_id, undefined, channel._id).then(res=> setIsLiked(0))
        break;
      case -1:
        likeService.addLike(video_id, undefined, channel._id).then(res=> {setIsLiked(1); likeService.removeDislike(video_id, undefined, channel._id)})
        break;
      default:
        likeService.addLike(video_id, undefined, channel._id).then(res=> setIsLiked(1))
        break;
    }
  }
  const onTryDislike = () =>{
    if(!channel) navigate("/login")
    switch (isLiked) {
      case 1:
        likeService.addDislike(video_id, undefined, channel._id).then(res=> {setIsLiked(-1); likeService.removeLike(video_id, undefined, channel._id)})
        break;
      case -1:
        likeService.removeDislike(video_id, undefined, channel._id).then(res=> setIsLiked(0))
        break;
      default:
        likeService.addDislike(video_id, undefined, channel._id).then(res=> setIsLiked(-1))
        break;
    }
  }

  const onEndPage = () => {
    videoService.getVideos({by_recommend: channel?._id},{}, videoList.length).then(res=>setVideoList([...videoList, ...res.videos])).catch(err => console.log(err.message));
  };

  const reloadVideos = () => {
    videoService.getVideos({by_recommend: channel?._id},{}, 0).then(res=>setVideoList(res.videos)).catch(err => console.log(err.message));
  };

  useEffect(()=> reloadVideos(), [selected_tags]);
  useEffect(() =>{
    reloadVideos()
    likeService.isLiked(video_id, channel?._id).then(res => res.result ?  setIsLiked(1) : likeService.isDisliked(video_id, channel?._id).then(res=> res.result && setIsLiked(-1)))
  }, [channel]);
  useEffect(()=> {
    console.log("video load - " + video_id)
    videoService.getVideo(video_id).then(res => setVideo(res.video)).catch(err => console.log(err.message))
    setTimeout(()=>{channel !== undefined && videoService.addView(video_id, channel?._id).then(res=> setVideo(v=> ({...v, views_count: v?.views_count + 1})))}, 10000);
    commentService.getCommentsByVideo(video_id, 0).then(res=> setCommentList(res.comments)).catch(err => console.log(err.message));
  }, [video_id]);

  const IsOwnerComponent =() => {
    return(<div>
      {video?.channel_id == channel?._id &&
        <button className="subscribe-button" style={{ background: "black" }} onClick={
          ()=>videoService.deleteVideo(video?._id).then(res=> navigate("/home")).catch(err => { console.log(err.message) })
        }>Delete Video</button>
      }
      {video?.channel_id == channel?._id && 
        <div className="like-section">
          <button className="like-button" onClick={()=>onTryLike()} style={{ borderRight: "2px grey solid" }}>
            {isLiked==1 ? <AiFillLike className="like-icon"/> : <AiOutlineLike className="like-icon"/> }
            {video?.likes_count}
          </button>
          <button className="like-button" onClick={()=>onTryDislike()}>
            {isLiked==-1 ? <AiFillDislike className="like-icon"/> : <AiOutlineDislike className="like-icon"/> }
            {video?.dislikes_count}
          </button>
        </div>
      }
    </div>)
  }

  const IsSubComponent = () => {
    return(<div>
      {video?.channel_id != channel?._id && 
        <Button variant="contained" color="secondary" sx={{borderRadius:'50px', background: isSubscribed ? "black": "red"}}
        onClick={()=>onTrySubscribe()}>{isSubscribed ? "Subscribed" : "Subscribe"}</Button>
      }
    </div>)
  }

  return (
    <div className="main-container">
      <Header/>
      <div className="video-page" onEndContent={onEndPage}>
        <div className="video-main">
          <div className="video-screen">
            <video className="video-screen" autoplay controls src={`${config.backendUrl}/${video?.videoUrl}`} type="video/mp4"></video>
          </div>
          <label style={{ fontSize: 20 }}>{video?.title}</label>
          <div className="video-header">
            <div className="author-data">
              {video?.channel.avatar_url ?
                <Avatar alt="ava" src={`${config.backendUrl}/${video?.channel.avatar_url}`}/> : 
                <Avatar sx={{ bgcolor: video?.channel.avatar_color }}>{video?.channel.channel_name.charAt(0).toUpperCase()}</Avatar> 
              }
              <div className="channel-data">
                <Link to={"/channel/"+video?.channel?._id}>{channel?.channel_name}</Link>
                <span>{video?.channel?.subs_count} Subs</span>
              </div>
              <IsSubComponent/>
            </div>
            <IsOwnerComponent/>
          </div>
          <div className="video-desc">
            <div className="video-views">
              <label>{video?.views_count} views</label>
              <label>{`Added: ${timeformat(video?.createdAt)}`}</label>
            </div>
            <div className="tags">
              {video?.tags.map(tag =>{ return <span>#{tag}</span>; })}
            </div>
            <label style={{ wordWrap: "break-word" }}>
              {video?.description || "Похоже у видео ещё нет описания"}
            </label>
          </div>
          <div className="comment-section">
            <div className="comment-count">{video?.comments_count} comments</div>
            <div className="comment-input"></div>
            <div className="comment-list">
              <h1>sdfs</h1><h1>sdfs</h1><h1>sdfs</h1><h1>sdfs</h1>
              {commentList?.map(comment =>{ return <CommentElement key={comment._id} comment={comment}/> })}
            </div>
          </div>
        </div>
        <div className="next-video-bar">
          <GanreBar tags={video?.tags} author={channel}/>
          <div>
            {videoList?.map(video =>{ return <NextVideoElement key={video._id} video={video} showDesc={false}/> })}
          </div>
        </div>
      </div>
    </div>
  );
}