import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import videoService from '../../services/VideoService';
import { accessStatusFormat, config, durationFormat, timeformat } from '../../shared';

export default function SelectVideos({ open, onClose, handleSelection }) {
    const [selectedVideos, setSelectedVideos] = useState([]);
    const { user, channel } = useContext(AuthContext);
    const [videosList, setVideosList] = useState([])

    const handleVideoSelection = (video) => {
        if (selectedVideos.includes(video)) {
            const updatedSelection = selectedVideos.filter((selectedVideo) => selectedVideo !== video);
            setSelectedVideos(updatedSelection);
        } else {
            setSelectedVideos([...selectedVideos, video]);
        }
    };

    const handleOk = () => {
        handleSelection(selectedVideos);
        onClose();
    }

    const onEndPage = () => {
        videoService.getVideosByChannel(channel?._id, videosList.length).then(res => { setVideosList([...videosList, ...res.videos]) })
    }
    useEffect(() => {
        if (!channel) { return }
        videoService.getVideosByChannel(channel?._id, 0).then(res => { setVideosList(res.videos) })
    }, [channel])

    return (
        <Dialog open={open} onClose={onClose} maxWidth='100vw'>
            <DialogTitle>Select Videos</DialogTitle>
            <DialogContent sx={{height:'75vh', overflowY:"scroll"}} onScroll={(e)=>{
                (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight-2) && onEndPage()
              }}>
                <Table>
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
                            return <TableRow key={video._id} selected={selectedVideos.includes(video)} onClick={() => handleVideoSelection(video)}>
                                <TableCell>
                                <div style={{display: 'flex'}}>
                                    <div style={{position: 'relative', display: 'flex', flexDirection: 'column', height:'72px'}}>
                                        <img className="video-manage-thumbnail" loading="lazy" src={`${config.backendUrl}/${video.thumbnail_url}`} alt="thumbnail"/>
                                        <label className="manage-thumbnail-duration">{durationFormat(video.duration)}</label>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <Typography noWrap maxWidth={"400px"}>{video.title}</Typography>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleOk}>OK</Button>
            </DialogActions>
        </Dialog>
    );
};