import "./styles.css";
import { IoLogoReact } from "react-icons/io5"
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"
import { useContext } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LogoutIcon from '@mui/icons-material/Logout';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import HistoryIcon from '@mui/icons-material/History';
import { Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";

export default function HiddenContainer({open,onClose}) {
  const { user, channel, setUser, setChannel } = useContext(AuthContext);
  return (
    <Drawer anchor='left' open={open} onClose={onClose}>
      <List sx={{ width: '100%', maxWidth: 360 }}>
      <ListItemButton>
        <IconButton aria-label="sidebar menu close" sx={{p: '4px'}} onClick={onClose}><MenuIcon fontSize="large"/></IconButton>
        <Link to="/">
          <button className="logo-element">
            <IoLogoReact className="logo-icon" alt="logo" />
            ReactTube
          </button>
        </Link>
      </ListItemButton>
      <Link to="/"><ListItemButton>
        <ListItemIcon><HomeIcon fontSize="large"/></ListItemIcon>
        <ListItemText primary="Main Page" />
      </ListItemButton></Link>
      <Link to="/history"><ListItemButton>
        <ListItemIcon><SubscriptionsIcon fontSize="large"/></ListItemIcon>
        <ListItemText primary="Subs Videos" />
      </ListItemButton></Link>
      <Divider sx={{marginTop:'10px',marginBottom:'10px'}}/>
      <Link to={`/channel/${channel?._id}`}><ListItemButton>
        <ListItemIcon><VideoCameraFrontIcon fontSize="large"/></ListItemIcon>
        <ListItemText primary="My Channel" />
      </ListItemButton></Link>
      <Link to="/history"><ListItemButton>
        <ListItemIcon><HistoryIcon fontSize="large"/></ListItemIcon>
        <ListItemText primary="History" />
      </ListItemButton></Link>
      {user && <ListItemButton onClick={()=>{
          setUser(null);
          setChannel(null);
          sessionStorage.removeItem('reacttube-user')
          sessionStorage.removeItem('reacttube-channel')
          localStorage.removeItem('reacttube-user')
          localStorage.removeItem('reacttube-channel');
          onClose();
        }}>
        <ListItemIcon><LogoutIcon fontSize="large"/></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>}
      </List>
    </Drawer>
    // <div className="hidden-container">
    //   <div className="hidden-sidebar">
    //     <div className="hidden-navigationbar">
    //       <Link to="/" className="nav-element-out">
    //         <button className="nav-element">
    //           <HiHome className="nav-img" src="" alt="home" />
    //           Main Page
    //         </button>
    //       </Link>
    //       <Link to="/history" className="nav-element-out">
    //         <button className="nav-element">
    //           <BsClockHistory className="nav-img" src="" alt="history" />
    //           History
    //         </button>
    //       </Link>
    //       <Link to="/subscribes" className="nav-element-out">
    //         <button className="nav-element">
    //           <MdSubscriptions className="nav-img" src="" alt="history" />
    //           Subscribes
    //         </button>
    //       </Link>
    //     </div>
    //     <div className="settingsbar">
    //         {user && <button className="nav-element" onClick={()=>{
    //           setUser(null);
    //           setChannel(null);
    //           sessionStorage.removeItem('reacttube-user')
    //           sessionStorage.removeItem('reacttube-channel')
    //           localStorage.removeItem('reacttube-user')
    //           localStorage.removeItem('reacttube-channel')
    //           setSidebarHidden(false)
    //         }}>
    //           <MdLogout className="nav-img" src="" alt="history" />
    //           Logout
    //         </button>}
    //     </div>
    //   </div>
    //   <div className="shadow-container" />
    // </div>
  );
}