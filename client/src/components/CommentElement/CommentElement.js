import "./styles.css"
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useContext, useEffect, useState } from "react";
import { config, timeformat } from "../../shared";
import { AuthContext } from "../../contexts/AuthContext";

export default function CommentElement({comment}){
    const { user, channel } = useContext(AuthContext)
    const [answerOpen, setAnswerOpen] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isDisliked, setIsDisliked] = useState(false)
    useEffect(()=>{

    },[channel])
    return(<div className="comment-container">
        {comment.channel?.avatar_url ?
            <Avatar alt="ava" src={`${config.backendUrl}/${comment.channel?.avatar_url}`}/> : 
            <Avatar sx={{ bgcolor: comment.channel?.avatar_color }}>{comment.channel?.channel_name.charAt(0).toUpperCase()}</Avatar> 
        }
        <div className="comment-body">
            <div style={{display:"flex"}}>
                <Typography>{comment.channel?.channel_name}</Typography>
                <span>{`${timeformat(comment.createdAt)}${comment.createdAt!=comment.updatedAt && "(Changed)"}`}</span>
            </div>
            <Typography>{comment.text}</Typography>
            <div style={{display:"flex"}}>
                <IconButton aria-label="add_video" sx={{p: '4px'}}>
                    <ThumbUpAltIcon fontSize="small"/> : <ThumbUpOffAltIcon fontSize="small"/>
                </IconButton>
                {comment.likes_count}
                <IconButton aria-label="add_video" sx={{p: '4px'}}>
                    <ThumbDownAltIcon fontSize="small"/> : <ThumbDownOffAltIcon fontSize="small"/>
                </IconButton>
                {comment.dislikes_count}
                <Button>Answer</Button>
            </div>
            {answerOpen &&
            <div>

            </div>
            }
        </div>
    </div>)
}