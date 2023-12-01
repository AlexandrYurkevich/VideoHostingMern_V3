import { Button, IconButton, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import DeleteIcon from '@mui/icons-material/Delete';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import EditIcon from '@mui/icons-material/Edit';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import videoService from "../../services/VideoService";
import playlistService from "../../services/PlaylistService";
import LoadVideo from "./LoadVideo";
import { accessStatusFormat, config, durationFormat, timeformat } from "../../shared";
import EditVideo from "./EditVideo";
import { Link } from "react-router-dom";
import AddPlaylist from "./AddPlaylist";

export default function VideoManagement() {
    const { user, channel } = useContext(AuthContext);
    const [videosList, setVideosList] = useState([])
    const [playlistsList, setPlaylistsList] = useState([])
    const [currentTab, setCurrentTab] = useState(0);
    const [isLoadVideoOpen, setLoadVideoOpen] = useState(false)
    const [isAddPlaylistOpen, setAddPlaylistOpen] = useState(false)
    const [currentEditVideo, setCurrentEditVideo] = useState("");

    const onEndPage = () => {
        currentTab == 0 ? videoService.getVideosByChannel(channel?._id, videosList.length).then(res=>{setVideosList([...videosList, ...res.videos])})
        : playlistService.getPlaylistsByChannel(channel?._id, playlistsList.length).then(res=>{setPlaylistsList([...playlistsList, ...res.playlists])})
    }

    useEffect(()=>{
        if(!channel){ return}
        videoService.getVideosByChannel(channel?._id, 0).then(res=>{setVideosList(res.videos)})
        playlistService.getPlaylistsByChannel(channel?._id, 0).then(res=>{console.log(res.playlists); setPlaylistsList(res.playlists)})
    },[channel])
    return(
        <div>
            <div className="between-header">
                <Typography variant="h5">Videos and Playlists Management</Typography>
                {currentTab == 0 ? <Button variant="outlined" startIcon={<FileUploadIcon />} onClick={()=>setLoadVideoOpen(true)}>Upload</Button>
                : <Button variant="outlined" startIcon={<AddIcon />} onClick={()=>setAddPlaylistOpen(true)}>Add Playlist</Button>}
            </div>
            <Tabs value={currentTab} onChange={(event, newValue) => {setCurrentTab(newValue)}} aria-label="management tabs">
                <Tab label="Videos"/>
                <Tab label="Playlists"/>
            </Tabs>
            <AddPlaylist open={isAddPlaylistOpen} onClose={()=>setAddPlaylistOpen(false)} onComplete={(added)=>{setPlaylistsList([added,...playlistsList])}}/>
            <LoadVideo open={isLoadVideoOpen} onClose={()=>setLoadVideoOpen(false)}/>
            <EditVideo video={currentEditVideo} onClose={()=>setCurrentEditVideo("")} onComplete={(updatedVideo)=>{
                let updatedList =[...videosList]
                let updatedIndex = videosList.findIndex((msg) => msg._id == updatedVideo._id);
                updatedList[updatedIndex] = updatedVideo
                setVideosList(updatedList);
                }}/>
            {currentTab == 0 ?
            <div style={{height:'75vh', overflowY:"scroll"}} onScroll={(e)=>{
                (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight-2) && onEndPage()
              }}>
                <TableContainer component={Paper}>
                    <Table sx={{ width: '100%' }} aria-label="videos table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Video</TableCell>
                                <TableCell>Access Status</TableCell>
                                <TableCell>Load Date</TableCell>
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
                                        <Typography noWrap maxWidth={"400px"}>{video.title}</Typography>
                                        <div style={{display: 'flex'}}>
                                            <IconButton onClick={()=>setCurrentEditVideo(video)}>
                                                <EditIcon fontSize="small"/>
                                            </IconButton>
                                            {video.access_status > 0 && <Link to={`/watch/${video._id}`}><IconButton>
                                                <OndemandVideoIcon fontSize="small"/>
                                            </IconButton></Link>}
                                        </div>
                                    </div>
                                </div>
                                </TableCell>
                                <TableCell>{accessStatusFormat(video.access_status)}</TableCell>
                                <TableCell>{timeformat(video.createdAt)}</TableCell>
                                <TableCell>{video.views_count}</TableCell>
                                <TableCell>{video.comments_count}</TableCell>
                                <TableCell>{video.dislikes_count + video.likes_count != 0 ? (video.likes_count/(video.likes_count + video.dislikes_count)*100 + "%") : "-"}</TableCell>
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
                                <TableCell>
                                <div style={{display: 'flex'}}>
                                    <div style={{position: 'relative', display: 'flex', flexDirection: 'column', height:'72px'}}>
                                        <img className="video-manage-thumbnail" loading="lazy" src={`${config.backendUrl}/${playlist.start_video?.video_id.thumbnail_url}`} alt="thumbnail"/>
                                        <label className="manage-thumbnail-duration"><PlaylistPlayIcon fontSize="small"/>{playlist.videos_count} videos</label>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <Typography noWrap maxWidth={"400px"}>{playlist.playlist_name}</Typography>
                                        <div style={{display: 'flex'}}>
                                        <IconButton onClick={()=>playlistService.deletePlaylist(playlist._id)
                                            .then(res=> setPlaylistsList(playlistsList.filter((p)=> p._id != playlist._id)))}>
                                            <DeleteIcon fontSize="small"/>
                                        </IconButton>
                                        </div>
                                    </div>
                                </div>
                                </TableCell>
                                <TableCell>{accessStatusFormat(playlist.access_status)}</TableCell>
                                <TableCell>{timeformat(playlist.updatedAt)}</TableCell>
                                <TableCell>{playlist.videos_count}</TableCell>
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