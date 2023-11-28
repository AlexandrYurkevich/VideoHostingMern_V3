import { Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import videoService from "../../services/VideoService";
import LoadVideo from "./LoadVideo";
import { config, durationFormat } from "../../shared";

export default function VideoManagement() {
    const { user, channel } = useContext(AuthContext);
    const [videosList, setVideosList] = useState([])
    const [playlistsList, setPlaylistsList] = useState([])
    const [currentTab, setCurrentTab] = useState(0);
    const [isLoadVideoOpen, setLoadVideoOpen] = useState(false)

    const accessStatusFormat = (status) =>{
        switch (status) {
            case 0: return "Черновик"
            case 1: return "Доступ по ссылке"
            default: return "Общий доступ"
        }
    }

    useEffect(()=>{
        channel && videoService.getVideosByChannel(channel?._id, videosList.length).then(res=>{console.log(res.videos); setVideosList(res.videos)})
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
                                <TableCell className="thumbnail-container" to={`/watch/${video._id}`} >
                                    <img className="next-video-thumbnail" src={`${config.backendUrl}/${video.thumbnail_url}`} alt="thumbnail"/>
                                    <label className="thumbnail-duration">{durationFormat(video.duration)}</label>
                                    {video.title}
                                </TableCell>
                                <TableCell>{accessStatusFormat(video.access_status)}</TableCell>
                                <TableCell>{video.publishAt || "-"}</TableCell>
                                <TableCell>{video.views_count}</TableCell>
                                <TableCell>{video.title}</TableCell>
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