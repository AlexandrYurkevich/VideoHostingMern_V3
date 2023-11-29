import { Alert, Backdrop, Button, CircularProgress, Dialog, Divider, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useContext, useState } from "react";
import videoService from "../../services/VideoService";
import uploadService from "../../services/UploadService";
import ThumbnailGenerator from "../../components/ThumbnailGenerator/ThumbnailGenerator";
import { AuthContext } from "../../contexts/AuthContext";
import { config } from "../../shared";

export default function LoadVideo({open, onClose}){
    const { user, channel } = useContext(AuthContext);
    const [video_url, setVideoUrl] = useState();
    const [thumbnail_url, setThumbnailUrl] = useState();
    const [duration, setVideoDuration] = useState();
    const [isVideoLoading, setVideoLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [loadingFinished, setLoadingFinished] = useState(false);
    const onDrop = (e)=> {
        if (!e.dataTransfer?.files[0].type.includes('video/')) return;
        e.preventDefault();
        setTitle(e.dataTransfer?.files[0].name);
        uploadVideo(e.dataTransfer?.files[0]);
    }
    const uploadVideo = (file)=> {
        if (!file) return;
        setVideoLoading(true);
        uploadService.upload(file,'video').then(res=> setVideoUrl(res.result))
    }

    const completeLoading = (blob)=> {
        console.log("complete loading");
        //new File([blob], `${Date.now()}.png`, { type: blob.type })
        //thumbnail_url && fetch(thumbnail_url).then(response => response.blob()).then(blob =>
        uploadService.upload(blob, 'thumbnail')
        .then(thumbnail => {
            videoService.loadVideo({title: title,channel_id: channel?._id,video_url, thumbnail_url: thumbnail.result,duration: duration})
            .then(res=>setLoadingFinished(true)).catch(err=>console.log(err.message)).finally(setVideoLoading(false));
        }).catch(err=>console.log(err.message))
    }

    return(
      <Dialog open={open} onClose={onClose}>
        {loadingFinished ? <Alert onClose={onClose}>Video successfully loaded. You can publish it in Video Management section on you channel's page.</Alert> :
        <div className="loadvideo-container">
            <div className="between-header">
                <Typography variant="h5">Load Video</Typography>
                <IconButton onClick={onClose}><CloseIcon/></IconButton>
            </div>
            <Divider/>
            <div className="drop-zone" onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}>
                <Typography>Drag and drop a video here</Typography>
                <span>До публикации, видео не будет доступно к просмотру</span>
                <OndemandVideoIcon sx={{fontSize:"60px"}}/>
            </div>
            <Button component="label" variant="contained" startIcon={<FileUploadIcon />}>
                Upload Video
                <input type="file" onChange={(e)=> {
                    setTitle(e.target.files[0].name);
                    uploadVideo(e.target.files[0])
                }} accept="video/*" style={{"display":"none"}} />
            </Button>
            <ThumbnailGenerator url={video_url ? `${config.backendUrl}/${video_url}` : ''} onGeneratedBlob={(blob)=>completeLoading(blob)} onMetaLoaded={(e)=>setVideoDuration((d)=> {return e.target.duration})}/>
        </div>}
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isVideoLoading}>
            <CircularProgress color="secondary" />
        </Backdrop>
      </Dialog>
    )
}