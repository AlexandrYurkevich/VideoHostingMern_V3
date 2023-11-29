import { Button, IconButton, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import EditIcon from '@mui/icons-material/Edit';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import videoService from "../../services/VideoService";
import LoadVideo from "./LoadVideo";
import { config, durationFormat } from "../../shared";
import EditVideo from "./EditVideo";

export default function VideoManagement() {
    const { user, channel } = useContext(AuthContext);
    const [videosList, setVideosList] = useState([])
    const [playlistsList, setPlaylistsList] = useState([])
    const [currentTab, setCurrentTab] = useState(0);
    const [isLoadVideoOpen, setLoadVideoOpen] = useState(false)
    const [currentEditVideo, setCurrentEditVideo] = useState("");

    const accessStatusFormat = (status) =>{
        switch (status) {
            case 0: return "Черновик"
            case 1: return "Доступ по ссылке"
            default: return "Общий доступ"
        }
    }

    useEffect(()=>{
        if(!channel){ return}
        videoService.getVideosByChannel(channel?._id, videosList.length).then(res=>{setVideosList(res.videos)})
    },[channel])
    return(
        <div>
            <div className="between-header">
                <Typography variant="h5">Videos and Playlists Management</Typography>
                <Button variant="outlined" startIcon={<FileUploadIcon />} onClick={()=>setLoadVideoOpen(true)}>Upload</Button>
            </div>
            <Tabs value={currentTab} onChange={(event, newValue) => {setCurrentTab(newValue)}} aria-label="management tabs">
                <Tab label="Videos"/>
                <Tab label="Playlists"/>
            </Tabs>
            <LoadVideo open={isLoadVideoOpen} onClose={()=>setLoadVideoOpen(false)}/>
            <EditVideo video={currentEditVideo} onClose={()=>setCurrentEditVideo("")}/>
            {currentTab == 0 ?
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ width: '100%' }} aria-label="videos table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Video</TableCell>
                                <TableCell>Access Status</TableCell>
                                <TableCell>Publish Date</TableCell>
                                <TableCell>Views</TableCell>
                                <TableCell>Comments</TableCell>
                                <TableCell>Like/Dislike Ratio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {videosList.map((video) => {
                            return <TableRow key={video._id}>
                                <TableCell>
                                <div style={{display: 'flex'}}>
                                    <div style={{position: 'relative', display: 'flex', flexDirection: 'column', height:'72px'}}>
                                        <img className="video-manage-thumbnail" loading="lazy" src={`${config.backendUrl}/${video.thumbnail_url}`} alt="thumbnail"/>
                                        <label className="manage-thumbnail-duration">{durationFormat(video.duration)}</label>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <Typography>{video.title}</Typography>
                                        <div style={{display: 'flex'}}>
                                            <IconButton onClick={()=>setCurrentEditVideo(video)}>
                                                <EditIcon fontSize="small"/>
                                            </IconButton>
                                            {video.access_status > 0 && <IconButton>
                                                <OndemandVideoIcon fontSize="small"/>
                                            </IconButton>}
                                        </div>
                                    </div>
                                </div>
                                </TableCell>
                                <TableCell>{accessStatusFormat(video.access_status)}</TableCell>
                                <TableCell>{video.publishAt || "-"}</TableCell>
                                <TableCell>{video.views_count}</TableCell>
                                <TableCell>{video.comments_count}</TableCell>
                                <TableCell>{video.dislikes_count != 0 ? (video.likes_count/(video.likes_count + video.dislikes_count)*100 + "%") : "-"}</TableCell>
                            </TableRow>
                        })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div> :
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ width: '100%' }} aria-label="playlists table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Playlist</TableCell>
                                <TableCell>Access Status</TableCell>
                                <TableCell>Change Date</TableCell>
                                <TableCell>Videos</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {playlistsList.map((playlist) => (
                            <TableRow key={playlist._id}>
                                <TableCell>{playlist.title}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        }
        </div>
    )
}