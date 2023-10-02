import "./styles.css";
import { config } from "../../shared";
import { ChannelContext } from "../../contexts/ChannelContext"
import { useRef, useContext, useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const {
    channelPage, setChannelPage,
    videoList, setVideoList,
    setFormHidden
  } = useContext(ChannelContext)
  const title = useRef();
  const description = useRef();
  const tags = useRef();
  const video = useRef();
  const thumbnail = useRef();
  const [errormes, setErrormes] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onUpload = async () => {
    try {
      if(/^\s*$/.test(title.current.value) || /^\s*$/.test(description.current.value)){
        setErrormes("fields can't consist only from spaces");
        return;
      }
      setIsLoading(true);
      let formData = new FormData();
      formData.append('video', video.current.files[0]);
      const filePath = await axios.post(`${config.backendUrl}/upload/video`, formData,{
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      formData = new FormData();
      formData.append('thumbnail', thumbnail.current.files[0]);
      const thumbnailPath = thumbnail.current.files[0] ? await axios.post(`${config.backendUrl}/upload/thumbnail`, formData,{
        headers: { 'Content-Type': 'multipart/form-data' }
      }) : null;

      const newVideo = await axios.post(`${config.backendUrl}/videos`, {
        title: title.current.value,
        description: description.current.value,
        tags: tags.current.value,
        channel: channelPage?._id,
        videoUrl : filePath.data,
        thumbnail: thumbnailPath?.data
      });
      setVideoList([...videoList, newVideo.data]);
      const videoId = newVideo.data._id;
      const updatedChannel = await axios.put(`${config.backendUrl}/channels/addvideo/${channelPage?._id}/${videoId}`);
      setChannelPage({...channelPage, videos: updatedChannel.data.videos});
      setIsLoading(false);
      setFormHidden(false);
    }
    catch (err) {
      setIsLoading(false);
      console.log(err.response.data.message);
    }
  }

  return (
    <div className="upload-container">
      <form  className="uploadwindow" style={isLoading ? {'display':'none'} : {}} onSubmit={(e)=> {e.preventDefault(); onUpload()}}>
        <label style={{color: 'red'}}>{errormes}</label>
        <div className="videoupload">
          <label>Select video to upload(mp4)</label>
          <input type="file" accept="video/mp4" required ref={video} />
          <label>Select thumbnail</label>
          <input type="file" accept="image/png,image/jpeg" ref={thumbnail} />
        </div>
        <div className="videodata">
          <div className="videodata-element">
            <label>Title</label>
            <input
              className="upload-field"
              type="text"
              required
              ref={title}
            />
          </div>
          <label>Description</label>
          <input
            className="upload-field"
            type="text"
            required
            ref={description}
          />
          <div className="videodata-element">
            <label>Tags</label>
            <input
              className="upload-field"
              type="text"
              ref={tags}
            />
          </div>
        </div>
        <div className="uploadsubmit">
          <input
            className="upload-button"
            type="submit"
            value="Upload Video"
          />
          <input className="upload-button" type="button" defaultValue="Cancel" onClick={()=> setFormHidden(false)} />
        </div>
      </form>
      {isLoading && <div className="uploadwindow">Loading...</div>}
    </div>
  );
}