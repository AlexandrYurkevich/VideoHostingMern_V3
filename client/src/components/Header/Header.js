import "./styles.css";
import "../../shared_styles.css"
import { config } from "../../shared";
import { useContext, useRef, useState } from "react";
import { Redirect, useNavigate } from "react-router-dom";
import {BsSearch } from "react-icons/bs"
import { IoLogoReact } from "react-icons/io5"
import HiddenContainer from "../HiddenContainer/HiddenContainer";

import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { Badge, IconButton } from "@mui/material";
import LoadVideo from "../../pages/Studio/LoadVideo";

export default function Header() {
  const searchField = useRef();
  const navigate = useNavigate();
  const { user, channel } = useContext(AuthContext)
  const [isLoadVideoOpen, setLoadVideoOpen] = useState(false)
  const [sidebarOpened, setSidebarOpened] = useState(false)

  return (
    <div>
      <div className="main-header">
        <div className="logo-container">
          {user && <IconButton aria-label="sidebar menu" sx={{p: '4px'}} onClick={()=>setSidebarOpened(true)}>
            <MenuIcon fontSize="large"/>
          </IconButton>}
          <Link to="/">
            <button className="logo-element">
              <IoLogoReact className="logo-icon" alt="logo" />
              ReactTube
            </button>
          </Link>
        </div>
        <div className="searchbar" role="search">
          <div className="input-box">
            <input style={{ fontSize: 16 }} onKeyUp={ (e)=> e.key == "Enter" && searchField.current.value && navigate("/search", {state:{pattern:searchField.current.value}})} placeholder="Input here" type="text" ref={searchField}/>
          </div>
          <button className="search-box" onClick={()=> searchField.current.value && navigate("/search", {state:{pattern:searchField.current.value}})}>
            <BsSearch className="search-img" alt="acc"/>
          </button>
        </div>
        <LoadVideo open={isLoadVideoOpen} onClose={()=>setLoadVideoOpen(false)}/>
        {user ?
          <div className="detached-container">
            <IconButton aria-label="add_video" sx={{p: '4px'}} onClick={()=>setLoadVideoOpen(true)}>
              <VideoCallIcon fontSize="large"/>
            </IconButton>
            <IconButton aria-label="notifications">
              <Badge badgeContent={0} color="primary"><NotificationsIcon /></Badge>
            </IconButton>
            <Link to = {`/channel/${channel?._id}`}>
            {channel?.avatar_url ?
              <Avatar alt="ava" src={`${config.backendUrl}/${channel?.avatar_url}`}/> : 
              <Avatar sx={{ bgcolor: channel?.avatar_color }}>{channel?.channel_name.charAt(0).toUpperCase()}</Avatar> 
            }
            </Link>
          </div>
          :
          <Link to = "/login"><Button variant="contained">Login In</Button></Link>}
      </div>
      <HiddenContainer open={sidebarOpened} onClose={()=> setSidebarOpened(false)}/>
    </div>
  );
}