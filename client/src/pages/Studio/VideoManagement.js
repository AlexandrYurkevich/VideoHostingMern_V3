import { Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from "@mui/material";
import { useState } from "react";

export default function VideoManagement() {
    const [videosList, setVideosList] = useState([])
    const [playlistsList, setPlaylistsList] = useState([])
    const [currentTab, setCurrentTab] = useState(0);
    return(
        <div>
            <Typography variant="h5">Videos and Playlists Management</Typography>
            <Tabs value={currentTab} onChange={(event, newValue) => {setCurrentTab(newValue)}} aria-label="management tabs">
                <Tab label="Videos"/>
                <Tab label="Playlists"/>
            </Tabs>
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
                        {videosList.map((video) => (
                            <TableRow key={video._id}>
                                <TableCell>{video.title}</TableCell>
                            </TableRow>
                        ))}
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