import { config,timeformat } from "../../shared";
import GanreBar from "../../components/GanreBar/GanreBar";
import Header from "../../components/Header/Header";
import {AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai"
import { Link } from "react-router-dom";
import "./styles.css";
import NextVideoElement from "../../components/NextVideoElement/NextVideoElement";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { TagContext } from "../../contexts/TagContext";
import videoService from "../../services/VideoService";
import subscribeService from "../../services/SubscribeService"
import CommentElement from "../../components/CommentElement/CommentElement";
import likeService from "../../services/LikeService";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import commentService from "../../services/CommentService";
import playlistService from "../../services/PlaylistService";
import NextPlaylistElement from "../../components/NextVideoElement/NextPlaylistElement";

export default function WatchVideo() {
  const params = useParams();
  const video_id = params.video_id, playlist_id = params.playlist_id, playlist_order = parseInt(params.playlist_order);
  const { selectedTagsFilter, selectedTagsSort } = useContext(TagContext);
  const { user, channel } =  useContext(AuthContext);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(0);
  const [video, setVideo] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [newComment, setNewComment]= useState("");
  const navigate = useNavigate();
  const [isViewAdded, setViewAdded] = useState(false);
  const [videoList, setVideoList] = useState([]);
  const [playlistVideoList, setPlaylistVideoList] = useState([]);
  const [commentList, setCommentList] = useState([]);

  const onTrySubscribe = () =>{
    if(!channel){ navigate("/login"); return;}
    isSubscribed ? subscribeService.removeSubscribe(video.channel_id, channel?._id).then(res=> setIsSubscribed(false)): subscribeService.addSubscribe(video.channel_id, channel?._id).then(res=> setIsSubscribed(true))
  }
  const onTryLike = () =>{
    if(!channel){ navigate("/login"); return;}
    switch (isLiked) {
      case 1:
        likeService.removeLike(video_id, undefined, channel._id).then(res=> setIsLiked(0))
        video.likes_count--;
        break;
      case -1:
        likeService.addLike(video_id, undefined, channel._id).then(res=> {setIsLiked(1); likeService.removeDislike(video_id, undefined, channel._id)})
        video.likes_count++; video.dislikes_count--;
        break;
      default:
        likeService.addLike(video_id, undefined, channel._id).then(res=> setIsLiked(1))
        video.likes_count++;
        break;
    }
  }
  const onTryDislike = () =>{
    if(!channel) navigate("/login")
    switch (isLiked) {
      case 1:
        likeService.addDislike(video_id, undefined, channel._id).then(res=> {setIsLiked(-1); likeService.removeLike(video_id, undefined, channel._id)})
        video.likes_count--; video.dislikes_count++;
        break;
      case -1:
        likeService.removeDislike(video_id, undefined, channel._id).then(res=> setIsLiked(0))
        video.dislikes_count--;
        break;
      default:
        likeService.addDislike(video_id, undefined, channel._id).then(res=> setIsLiked(-1))
        video.dislikes_count++;
        break;
    }
  }

  const onEndPage = () => {
    videoService.getVideos(selectedTagsFilter,selectedTagsSort, videoList.length).then(res=>setVideoList([...videoList, ...res.videos])).catch(err => console.log(err.message));
  };
  const onEndPlaylist = () =>{
    playlistService.getPlaylistVideos(playlist_id, playlistVideoList.length).then(res=> setPlaylistVideoList((prev) => [...prev, ...res.videos]));
  }

  const reloadVideos = () => {
    videoService.getVideos(selectedTagsFilter,selectedTagsSort, 0).then(res=>setVideoList(res.videos)).catch(err => console.log(err.message));
  };
  const onNewComment = () => {
    if(!channel){ navigate("/login"); return;}
    commentService.addComment(video?._id, channel?._id, newComment, undefined).then(res=> {setCommentList([res.comment, ...commentList]); video.comments_count++; })
  }

  const tryAddView = (e) => {
    if (!isViewAdded && e.target.currentTime >= 10) {
      setViewAdded(true);
      videoService.addView(video_id, channel?._id).then(res=> setVideo(v=> ({...v, views_count: v?.views_count + 1})));
    }
  }
  const onFinishVideo = () => {
    if(playlist_id && playlist.videos_count - 1 > playlist_order){
      const nextOrder = playlist_order+1;
      if(playlistVideoList.length > nextOrder){
        const nextVideo = playlistVideoList[nextOrder];
        navigate(`/watch/${nextVideo._id}/${playlist_id}/${nextOrder}`);
      }
      else{
        playlistService.getPlaylistVideos(playlist_id, playlistVideoList.length)
        .then(res=> {
          setPlaylistVideoList((prev) => [...prev, ...res.videos]);
          const nextVideo = playlistVideoList[nextOrder];
          navigate(`/watch/${nextVideo._id}/${playlist_id}/${nextOrder}`);
        }).catch(err => console.log(err.message));
      }
      const nextVideo = playlistVideoList[nextOrder];
      navigate(`/watch/${nextVideo._id}/${playlist_id}/${nextOrder}`);
    }
  }
  const isVideoVisible = () => video != null && video.access_status > 0 && (video.access_status > 1 || video.channel_id == channel?._id)

  useEffect(()=> reloadVideos(), [selectedTagsFilter,selectedTagsSort]);
  useEffect(() =>{
    reloadVideos()

    console.log(video?.channel_id  + " -ssss "+ channel?._id) 
    channel && subscribeService.isSubscribed(video?.channel_id, channel?._id).then(res=> setIsSubscribed(res.result))
    likeService.isLiked(video_id,undefined, channel?._id).then(res => res.result ?  setIsLiked(1) : likeService.isDisliked(video_id, undefined,channel?._id).then(res=> res.result && setIsLiked(-1)))
  }, [video,channel,video_id]);
  useEffect(()=> {
    console.log("video load - " + video_id)
    setViewAdded(false)
    setIsLiked()
    videoService.getVideo(video_id).then(res => setVideo(res.video)).catch(err => console.log(err.message))
    if(playlist_id){
      playlistService.getPlaylist(playlist_id).then(res=> setPlaylist(res.playlist)).catch(err => console.log(err.message));
      playlistService.getPlaylistVideos(playlist_id, 0).then(res=> setPlaylistVideoList(res.videos)).catch(err => console.log(err.message));
    }
    commentService.getCommentsByVideo(video_id, 0).then(res=> setCommentList(res.comments)).catch(err => console.log(err.message));
  }, [video_id,playlist_id]);

  const IsOwnerComponent =() => {
    return(<div>
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
    </div>)
  }

  const IsSubComponent = () => {
    return(<div>
      {video?.channel_id != channel?._id ? 
        <Button variant="contained" sx={{borderRadius:'50px', background: isSubscribed ? "black": "red"}}
        onClick={()=>onTrySubscribe()}>{isSubscribed ? "Subscribed" : "Subscribe"}</Button>
      : <div style={{display: "flex", gap:"5px"}}>
          <Button variant="contained" color="secondary" sx={{borderRadius:'50px'}}
        onClick={()=>navigate("/studio/videos") }>Manage Videos</Button>
          <Button variant="contained" sx={{borderRadius:'50px', background: "black"}}
        onClick={
          ()=>videoService.deleteVideo(video?._id).then(res=> navigate("/")).catch(err => { console.log(err.message) })
        }>Delete Video</Button>
        </div>}
    </div>)
  }

  return (channel === undefined || video == null || video_id == undefined ? "" : 
    <div className="main-container">
      <Header/>
      <div className="video-page" onScroll={(e)=>(e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight - 2) && onEndPage()}>
        { isVideoVisible() ? 
        <div className="video-main">
          <div className="video-screen">
            <video className="video-screen" autoplay src={`${config.backendUrl}/${video?.video_url}`} controls type="video/mp4"
            onTimeUpdate={(e)=> tryAddView(e)} onEnded={(e)=>onFinishVideo()} onCanPlay={(e)=>e.target.play()}></video>
          </div>
          {video?.access_status!=3&& <label style={{background:'lightgrey', width:'max-content'}}>Ограниченный доступ</label>}
          <label className="video-title">{video?.title}</label>
          <div className="video-header">
            <div className="author-data">
              {video?.channel.avatar_url ?
                <Avatar alt="ava" src={`${config.backendUrl}/${video?.channel.avatar_url}`}/> : 
                <Avatar sx={{ bgcolor: video?.channel.avatar_color }}>{video?.channel.channel_name.charAt(0).toUpperCase()}</Avatar> 
              }
              <div className="channel-data">
                <Link to={"/channel/"+video?.channel?._id}>{video?.channel.channel_name}</Link>
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
            <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-line' }}>
              {video?.description || "Похоже у видео ещё нет описания"}
            </Typography>
          </div>
          <Typography className="video-desc">Category - {video?.category}</Typography>
          { video.allow_comments ? <div className="comment-section">
            <Typography className="comment-count" variant="h4">{video?.comments_count} comments</Typography>
            <div className="comment-input-container">
              {channel?.avatar_url ?
                <Avatar alt="ava" src={`${config.backendUrl}/${channel?.avatar_url}`}/> : 
                <Avatar sx={{ bgcolor: channel?.avatar_color }}>{channel?.channel_name.charAt(0).toUpperCase()}</Avatar> 
              }
              <div className="comment-input">
                <TextField sx={{ width: '700px' }} type="text" multiline inputProps={{ maxLength: 1000 }}
                    value={newComment} onChange={(event)=> setNewComment(event.target.value)}
                    helperText={`${newComment.length}/1000`}
                    placeholder="Tell audience about your channel"
                />
                <div className="comment-input-actions">
                  <Button variant="contained" disabled={newComment.length == 0 || /^\s*$/.test(newComment)} onClick={()=>onNewComment()}>Send Comment</Button>
                </div>
              </div>
            </div>
            <div className="comment-list">
              {commentList?.map(comment =>{ return <CommentElement key={comment._id} video={video} comment={comment}/> })}
            </div>
            <Button onClick={()=>commentService.getCommentsByVideo(video_id, commentList.length)
              .then(res=> setCommentList([...commentList, ...res.comments])).catch(err => console.log(err.message))}>Load More</Button>
          </div> : 
          <Typography variant="h4" sx={{display:"flex", justifyContent: "center"}}>Comments are not allowed for this video</Typography>}
        </div> :
        <div className="video-main">
          <div className="video-screen">
            <div className="video-screen">
              <Typography variant="h5" sx={{color:"white"}}>{"=("} Video failed to load. It's can be hidden or deleted</Typography>
            </div>
          </div>
        </div>
        }
        <div className="next-video-bar">
          {playlist_id &&
          <div className="playlist-header" style={{border:"5px black solid"}}>
            <Typography variant="h4">{playlist?.playlist_name}</Typography>
            <Typography variant="h5">{playlist_order+1} video from {playlist?.videos_count}</Typography>
          </div>}
          {playlist_id && <div className="playlist-bar" onScroll={(e)=>(e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight - 2) && onEndPlaylist()}>
            {playlistVideoList?.map((video,index) =>{ return <NextPlaylistElement key={video._id} video={video} playlist={playlist_id} playlist_order={index} showSelect={playlist_order == index}/> })}
          </div>}
          <GanreBar video={video}/>
          <div>
            {videoList?.map(video =>{ return <NextVideoElement key={video._id} video={video} showDesc={false}/> })}
          </div>
        </div>
      </div>
    </div>
  );
}