import "./styles.css";
import { config } from "../../shared";
import Header from "../../components/Header/Header"
import { HeaderProvider } from "../../contexts/HeaderContext";
import { VscAccount } from "react-icons/vsc";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";


export default function SubscribesVideo() {
  const { user } = useContext(AuthContext)
  const [channelsList, setChannelsList] = useState([]);

  useEffect(() => {
    const getSubsChannels = async () => {
      try {
          const res = await axios.get(`${config.backendUrl}/channels/subs/${user._id}`);
          setChannelsList(res.data.subscribedChannels);
      } catch (err) {
          console.log("fdgdg" + err);
      }
    };
    getSubsChannels();
  }, []);

  return (
    <div className="main-container">
      <HeaderProvider><Header/></HeaderProvider>
      <div className="video-list">
        {channelsList.map(channel =>{
          return <Link to={`/channel/${channel._id}`} style={{ display: "flex", background:"white", gap: 10 }}>
            {channel.avatar ? <img className="channel-icon-big" src={`${config.backendUrl}/${channel.avatar}`} alt="icon" /> :  <VscAccount className="channel-icon-big"/>}
            <div className="channel-data">
              <label className="channel-name">{channel.name}</label>
              <div style={{ display: "flex", gap: 5 }}>
                <span>@{channel._id}</span>
                <span>{channel.subscribers.length} subcribers</span>
                <span>{channel.videos.length} video</span>
              </div>
              <span style={{ wordWrap: "break-word" }}>
                {channel.description}
              </span>
            </div>
          </Link>
          })}
      </div>
    </div>
  );
}