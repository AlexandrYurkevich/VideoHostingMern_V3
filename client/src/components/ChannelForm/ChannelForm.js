import "./styles.css";
import { ChannelContext } from "../../contexts/ChannelContext"
import { AuthContext } from "../../contexts/AuthContext";
import { useRef, useContext, useState, useEffect } from "react";
import sharedService from "../../services/SharedService";
import channelService from "../../services/ChannelService";

export default function ChannelForm() {
  const {
    channelPage, setChannelPage,
    setEditHidden
  } = useContext(ChannelContext)
  const { setChannel } = useContext(AuthContext);
  const [errormes, setErrormes] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const channel_name = useRef();
  const channel_desc = useRef();
  const avatar = useRef();
  const header = useRef();

  const onUpdate = () => {
      if(/^\s*$/.test(channel_name.current.value) || /^\s*$/.test(channel_desc.current.value)){
        setErrormes("fields can't consist only from spaces");
        return;
      }
      setIsLoading(true);
      let avatarPath = null, headerPath = null;
      sharedService.upload(avatar.current.files[0], 'avatar').then(res=> avatarPath = res.result)
      sharedService.upload(header.current.files[0], 'header').then(res=> headerPath = res.result)
      channelService.editChannel(channelPage._id, {
        channel_name: channel_name.current.value,
        channel_desc: channel_desc.current.value,
        avatar_url: avatarPath?.data,
        header: headerPath?.data
      }).then(res => {
        setChannelPage(res.updatedChannel);
        setChannel(res.updatedChannel);
        setEditHidden(false);
      }).catch(err => {
        setErrormes("Channel title is already held");
      })
      setIsLoading(false);
    }

  useEffect(()=>{ channel_name.current.value = channelPage.channel_name;
    channel_desc.current.value = channelPage.channel_desc; },[])

  return (
    <div className="upload-container">
      <form className="uploadwindow" style={isLoading ? {'display':'none'} : {}} onSubmit={(e)=> {e.preventDefault(); onUpdate()}}>
        <label style={{color: 'red'}}>{errormes}</label>
        <div className="videoupload">
          <label>Select avatar</label>
          <input type="file" accept="image/png,image/jpeg" ref={avatar} />
          <label>Select header</label>
          <input type="file" accept="image/png,image/jpeg" ref={header} />
        </div>
        <div className="videodata">
          <div className="videodata-element">
            <label>Name</label>
            <input
              className="upload-field"
              type="text"
              required
              ref={channel_name}
            />
          </div>
          <label>Description</label>
          <input
            className="upload-field"
            type="text"
            required
            ref={channel_desc}
          />
        </div>
        <div className="uploadsubmit">
          <input
            className="upload-button"
            type="submit"
            value="Submit changes"
          />
          <input className="upload-button" type="button" defaultValue="Cancel" onClick={()=> setEditHidden(false)} />
        </div>
      </form>
      {isLoading && <div className="uploadwindow">Loading...</div>}
    </div>
  );
}