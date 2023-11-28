import "./styles.css"
import "../../shared_styles.css"
import { Avatar, Tab, Tabs, Typography } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { config } from "../../shared";
import Header from "../../components/Header/Header";
import VideoManagement from "./VideoManagement";
import EditChannel from "./EditChannel";

export default function Studio() {
    const { user, channel } = useContext(AuthContext);
    const { tab } = useParams();
    const [currentTab,setCurrentTab] = useState(tab || "main_page")
    return (
        <div className="main-container">
            <Header/>
            <div className="studio-container">
                <div className="studio-sidebar-vert">
                    {channel?.avatar_url ? 
                    <Avatar sx={{ width: 160, height: 160 }} alt="ava" src={`${config.backendUrl}/${channel?.avatar_url}`}/> : 
                    <Avatar sx={{ bgcolor: channel?.avatar_color,width: 160, height: 160,fontSize: '80px' }}>{channel?.channel_name.charAt(0).toUpperCase()}</Avatar> 
                    }
                    <Typography variant="h5">Your channel</Typography>
                    <span>{channel?.channel_name}</span>
                    <Tabs value={currentTab} orientation="vertical" onChange={(event, newValue) => {
                        setCurrentTab(newValue); window.history.pushState(null, '', "/studio/" + newValue)}} aria-label="channel tabs">
                        <Tab icon={<DashboardIcon/>} iconPosition="start" label="Main Page" value="main_page"/>
                        <Tab icon={<VideoLibraryIcon/>} iconPosition="start" label="Content" value="videos"/>
                        <Tab icon={<AutoFixHighIcon/>} iconPosition="start" label="Channel Editing" value="editing"/>
                    </Tabs>
                </div>
                <div className="studio-body">
                    {currentTab == "videos" && <VideoManagement/>}
                    {currentTab == "editing" && <EditChannel/> }
                </div>
                {/* <div className="analitics-28-body">
                    <div className="subs"></div>
                    <div className="views"></div>
                </div> */}
                <div className="comments-body">

                </div>
                <div className="channel-settings-body">
                    <div className="main">
                        <div className="trailer"></div>
                        <div className="recomend-videos"></div>
                        <div className="recomend-channels"></div>
                        <div className="main-playlists"></div>
                    </div>
                    <div className="main-data">
                        <div className="name"></div>
                        <div className="desc"></div>
                        <div className="contacts"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}