import "./styles.css";
import { VscMenu } from "react-icons/vsc"
import { BsClockHistory } from "react-icons/bs"
import { MdSubscriptions, MdLogout } from "react-icons/md"
import { HiHome } from "react-icons/hi"
import { IoLogoReact } from "react-icons/io5"
import { Link } from "react-router-dom";

import { HeaderContext } from "../../contexts/HeaderContext"
import { AuthContext } from "../../contexts/AuthContext"
import { useContext } from "react";

export default function HiddenContainer() {
  const { user, setUser, setChannel } = useContext(AuthContext);
  const { setSidebarHidden } = useContext(HeaderContext)
  return (
    <div className="hidden-container">
      <div className="hidden-sidebar">
        <div className="sidebar-header">
          <button className="logo-element" onClick={()=>setSidebarHidden(false)}>
            <VscMenu className="logo-menu" alt="menu" />
          </button>
          <Link to="/">
          <button className="logo-element">
            <IoLogoReact className="logo-icon" alt="logo" />
            ReactTube
          </button>
          </Link>
        </div>
        <div className="hidden-navigationbar">
          <Link to="/" className="nav-element-out">
            <button className="nav-element">
              <HiHome className="nav-img" src="" alt="home" />
              Main Page
            </button>
          </Link>
          <Link to="/history" className="nav-element-out">
            <button className="nav-element">
              <BsClockHistory className="nav-img" src="" alt="history" />
              History
            </button>
          </Link>
          <Link to="/subscribes" className="nav-element-out">
            <button className="nav-element">
              <MdSubscriptions className="nav-img" src="" alt="history" />
              Subscribes
            </button>
          </Link>
        </div>
        <div className="settingsbar">
            {user && <button className="nav-element" onClick={()=>{
              setUser(null);
              setChannel(null);
              sessionStorage.removeItem('reacttube-user')
              sessionStorage.removeItem('reacttube-channel')
              localStorage.removeItem('reacttube-user')
              localStorage.removeItem('reacttube-channel')
              setSidebarHidden(false)
            }}>
              <MdLogout className="nav-img" src="" alt="history" />
              Logout
            </button>}
        </div>
      </div>
      <div className="shadow-container" />
    </div>
  );
}