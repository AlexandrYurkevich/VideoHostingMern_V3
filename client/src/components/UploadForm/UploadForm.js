import "./styles.css";
import { ChannelContext } from "../../contexts/ChannelContext"
import { useRef, useContext, useState } from "react";
import videoService from "../../services/VideoService";

export default function UploadForm() {
  const {
    channelPage, setChannelPage,
    videoList, setVideoList,
    setFormHidden
  } = useContext(ChannelContext)
  const title = useRef();
  const description = useRef();
  const tags = useRef();
  const videoFile = useRef();
  const thumbnailFile = useRef();
  const [errormes, setErrormes] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onUpload = () => {
      if(/^\s*$/.test(title.current.value) || /^\s*$/.test(description.current.value)){
        setErrormes("fields can't consist only from spaces");
        return;
      }
      setIsLoading(true);
      let videoUrl, thumbnailUrl;
      videoService.upload(videoFile.current.files[0], 'video').then(res=> videoUrl = res.result)
      videoService.upload(thumbnailFile.current.files[0], 'thumbnail').then(res=> thumbnailUrl = res.result)
      videoService.loadVideo({
        title: title.current.value,
        description: description.current.value,
        tags: tags.current.value,
        channel_id: channelPage?._id,
        videoUrl,
        thumbnailUrl
      }).then(res=> {
        setVideoList([...videoList, res.newVideo])
        setFormHidden(false);
      })
      setIsLoading(false);
  }

  return (
    <div className="upload-container">
      <form  className="uploadwindow" style={isLoading ? {'display':'none'} : {}} onSubmit={(e)=> {e.preventDefault(); onUpload()}}>
        <label style={{color: 'red'}}>{errormes}</label>
        <div className="videoupload">
          <label>Select video to upload(mp4)</label>
          <input type="file" accept="video/mp4" required ref={videoFile} />
          <label>Select thumbnail</label>
          <input type="file" accept="image/png,image/jpeg" ref={thumbnailFile} />
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