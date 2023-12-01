import "./styles.css"
import { useNavigate } from "react-router-dom";
import { Avatar, Button, IconButton, TextField, Typography } from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useContext, useEffect, useState } from "react";
import { config, timeformat } from "../../shared";
import { AuthContext } from "../../contexts/AuthContext";
import likeService from "../../services/LikeService";
import commentService from "../../services/CommentService";

export default function CommentElement({video, comment,onParentAnswer}){
    const { user, channel } = useContext(AuthContext)
    const [answerOpen, setAnswerOpen] = useState(false)
    const [answersOpen, setAnswersOpen] = useState(false)
    const [isLiked, setIsLiked] = useState(0)
    const [answersList, setAnswersList] = useState([]);
    const [newComment, setNewComment]= useState("");
    const navigate = useNavigate();
    const onNewComment = () => {
        if(!channel){ navigate("/login"); return;}
        commentService.addComment(video._id, channel?._id, newComment, comment.parent_id ? comment.parent_id : comment._id).then(res=> {console.log(res.comment);
            if(onParentAnswer) { onParentAnswer(res.comment) }
            else { setAnswersList([...answersList, res.comment]); comment.answers_count++; }
            video.comments_count++;
        }).finally(setAnswerOpen(false));
    }
    const onTryLike = () =>{
    if(!channel){ navigate("/login"); return;}
    switch (isLiked) {
        case 1:
        likeService.removeLike(undefined, comment._id, channel._id).then(res=> setIsLiked(0)); comment.likes_count--;
        break;
        case -1:
        likeService.addLike(undefined, comment._id, channel._id).then(res=> {setIsLiked(1); likeService.removeDislike(undefined, comment._id, channel._id)});
        comment.likes_count++;comment.dislikes_count--;
        break;
        default:
        likeService.addLike(undefined, comment._id, channel._id).then(res=> setIsLiked(1)); comment.likes_count++;
        break;
    }
    }
    const onTryDislike = () =>{
    if(!channel) navigate("/login")
    switch (isLiked) {
        case 1:
        likeService.addDislike(undefined, comment._id, channel._id).then(res=> {setIsLiked(-1); likeService.removeLike(undefined, comment._id, channel._id)})
        comment.dislikes_count++;comment.likes_count--;
        break;
        case -1:
        likeService.removeDislike(undefined, comment._id, channel._id).then(res=> setIsLiked(0)); comment.dislikes_count--;
        break;
        default:
        likeService.addDislike(undefined, comment._id, channel._id).then(res=> setIsLiked(-1)); comment.dislikes_count++;
        break;
    }
    }
    useEffect(()=>{
        likeService.isLiked(undefined, comment._id, channel?._id).then(res => res.result ?  setIsLiked(1) : likeService.isDisliked(undefined,comment._id, channel?._id).then(res=> res.result && setIsLiked(-1)))
    },[channel])
    return(<div className="comment-container">
        {comment.channel?.avatar_url ?
            <Avatar alt="ava" src={`${config.backendUrl}/${comment.channel?.avatar_url}`}/> : 
            <Avatar sx={{ bgcolor: comment.channel?.avatar_color }}>{comment.channel?.channel_name.charAt(0).toUpperCase()}</Avatar> 
        }
        <div className="comment-body">
            <div style={{display:"flex", alignItems:"center"}}>
                <Typography>{comment.channel?.channel_name}</Typography>
                <span>{`${timeformat(comment.createdAt)}${comment.createdAt!=comment.updatedAt ? "(Changed)": ""}`}</span>
            </div>
            <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-line' }}>{comment.text}</Typography>
            <div style={{display:"flex", alignItems:"center",gap:"5px"}}>
                <IconButton aria-label="add_video" sx={{p: '4px'}} onClick={()=>onTryLike()}>
                    {isLiked == 1 ? <ThumbUpAltIcon fontSize="small"/> : <ThumbUpOffAltIcon fontSize="small"/>}
                </IconButton>
                {comment.likes_count}
                <IconButton aria-label="add_video" sx={{p: '4px'}} onClick={()=>onTryDislike()}>
                    {isLiked == -1 ?<ThumbDownAltIcon fontSize="small"/> : <ThumbDownOffAltIcon fontSize="small"/>}
                </IconButton>
                {comment.dislikes_count}
                <Button variant="outlined" sx={{borderRadius:"20px"}} onClick={()=>setAnswerOpen(true)}>Answer</Button>
            </div>
            {answerOpen &&
            <div className="comment-input-container">
            {channel?.avatar_url ?
              <Avatar alt="ava" src={`${config.backendUrl}/${channel?.avatar_url}`}/> : 
              <Avatar sx={{ bgcolor: channel.avatar_color }}>{channel?.channel_name.charAt(0).toUpperCase()}</Avatar> 
            }
            <div className="comment-input">
              <TextField sx={{ width: '650px' }} type="text" multiline inputProps={{ maxLength: 1000 }}
                  value={newComment} onChange={(event)=> setNewComment(event.target.value)}
                  helperText={`${newComment.length}/1000`}
                  placeholder="Tell audience about your channel"
              />
              <div className="comment-input-actions">
              <Button variant="contained" onClick={()=>setAnswerOpen(false)}>Cancel</Button>
                <Button variant="contained" disabled={newComment.length == 0 || /^\s*$/.test(newComment)} onClick={()=>onNewComment()}>Send Comment</Button>
              </div>
            </div>
          </div>
            }
            {comment.answers_count > 0 ? <Button sx={{width:"fit-content"}} onClick={()=>{
                answersList.length == 0 && commentService.getCommentsByComment(comment._id, 0).then(res=> setAnswersList(res.comments))
                setAnswersOpen(!answersOpen)
                }
            }>{answersOpen ? <KeyboardArrowUpIcon/>: <KeyboardArrowDownIcon/> }{comment.answers_count} Answers</Button> : ""}
            {answersOpen && answersList?.map(coment =>{ return <CommentElement style={{marginLeft: "40px"}} key={coment._id} video={video} comment={coment}
            onParentAnswer={(com)=>{setAnswersList([...answersList,com]); comment.answers_count++;}}/> })}
            {answersOpen &&answersList.length < comment.answers_count && <Button onClick={()=>commentService.getCommentsByComment(comment._id, answersList.length)
                    .then(res=> setAnswersList([...answersList, ...res.comments])).catch(err => console.log(err.message))}>Load More</Button>}
        </div>
    </div>)
}