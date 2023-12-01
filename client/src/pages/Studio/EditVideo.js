import { Alert, Backdrop, Button, CircularProgress, Dialog, Divider, FormControlLabel, IconButton, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { useContext, useEffect, useState } from "react";
import videoService from "../../services/VideoService";
import uploadService from "../../services/UploadService";
import ThumbnailGenerator from "../../components/ThumbnailGenerator/ThumbnailGenerator";
import { AuthContext } from "../../contexts/AuthContext";
import { config } from "../../shared";
import { IoDesktopOutline } from "react-icons/io5";

export default function EditVideo({video, onClose, onComplete}){
    const { user, channel } = useContext(AuthContext);
    const [thumbnail_url, setThumbnailUrl] = useState("");
    const [selected_url, setSelectedUrl] = useState("");
    const [thumbList, setThumblist] = useState([]);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newTags, setNewTags] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Животные");
    const [allowComments, setAllowComments] = useState(true);
    const [adultContent, setAdultContent] = useState(false);
    const [accessStatus, setAccessStatus] = useState(3);

    useEffect(()=>{
        setNewName(video.title || "");
        setNewDesc(video.desc || "");
        setSelectedUrl(video.thumbnail_url);
        setNewTags(video.tags?.join(',') || "");
        setSelectedCategory(video.category || "Животные");
        setAdultContent(video.adultContent || false)
        IoDesktopOutline.access_status > 0 && setAccessStatus(video.access_status);
    },[video]);

    const handleNewThumb =(file) => {
        uploadService.upload(file,'thumbnail').then(res=> setThumblist([...thumbList, res.result])).catch(err=> console.log(err.message))
    }

    const handleSubmit = () => {
        thumbList.forEach(url => {
            url != selected_url && uploadService.delete(url);
        });
        video.thumbnail_url != selected_url && uploadService.delete(video.thumbnail_url);
        thumbnail_url && thumbnail_url != selected_url && uploadService.delete(thumbnail_url);
        videoService.editVideo(video._id, {
            title: newName, desc: newDesc, thumbnail_url: selected_url, category: selectedCategory, tags: newTags.split(/[,;]+/).filter(element => element),
             access_status: accessStatus, adult_content: adultContent, allow_comments: allowComments
        }).then(res=> { onComplete(res.updatedVideo); onClose();})
    }

    return(
      <Dialog open={video != ""} onClose={onClose} maxWidth='100vw'>
        <form className="loadvideo-container">
            <div className="between-header">
                <Typography variant="h5">Edit Video</Typography>
                <IconButton onClick={onClose}><CloseIcon/></IconButton>
            </div>
            <Divider/>
            <div style={{ display: "flex", gap: '10px', overflowY: 'auto' }}>
                <div className="editvideo-form">
                    <TextField label="Video title" required value={newName} onChange={(e)=> setNewName(e.target.value)}></TextField>
                    <TextField type="text" multiline inputProps={{ maxLength: 1000 }}
                        value={newDesc} onChange={(event)=> setNewDesc(event.target.value)}
                        helperText={`${newDesc?.length}/1000`} placeholder="Describe your video"></TextField>
                    <div style={{display: "flex",justifyContent: "flex-start",flexDirection: "column" }} >
                        <Typography>Thumbnail</Typography>
                        <span>Выберите превью из предложенных или загрузите новое. Размер не больше 4 Mb.</span>
                        <div className="thumb-list">
                            <img className="video-manage-thumbnail" style={selected_url == video.thumbnail_url ? {border: "4px #ffb340 solid"}: {}}
                             src={`${config.backendUrl}/${video.thumbnail_url}`} onClick={()=>setSelectedUrl(video.thumbnail_url)}/>
                            {thumbnail_url && <img className="video-manage-thumbnail" style={selected_url == thumbnail_url ? {border: "4px #ffb340 solid"}: {}}
                             src={`${config.backendUrl}/${thumbnail_url}`} onClick={()=>setSelectedUrl(thumbnail_url)}/>}
                            {thumbList.map(url=>(
                                <img className="video-manage-thumbnail"  style={selected_url == url ? {border: "4px #ffb340 solid"}: {}} 
                                src={`${config.backendUrl}/${url}`} onClick={()=>setSelectedUrl(url)}/>
                            ))}
                            <label className="video-manage-thumbnail add-thumb">
                            Load Thumbnail
                            <ImageIcon fontSize="small"/>
                            <input type="file" onChange={(e)=> handleNewThumb(e.target.files[0])} accept="image/*" style={{"display":"none"}} />
                            </label>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography>Adult content</Typography>
                        <span>Видео, предназначенные только для зрителей старше 18 лет</span>
                        <RadioGroup value={adultContent} onChange={(e)=> setAdultContent(e.target.value)} defaultValue="false">
                            <FormControlLabel value={true} control={<Radio />} label="Содержит взрослый контент" />
                            <FormControlLabel value={false} control={<Radio />} label="Не содержит взрослый контент" />
                        </RadioGroup>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography>Tags</Typography>
                        <span>Рекомендуем добавлять теги для облегчения поиска. Разделитель - запятая</span>
                        <TextField value={newTags} onChange={(event)=> setNewTags(event.target.value)}></TextField>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography>Category</Typography>
                        <span>Укажите категорию контента – так пользователям будет проще находить этот ролик</span>
                        <Select value={selectedCategory} onChange={(e)=> setSelectedCategory(e.target.value)}>
                            <MenuItem value="Животные">Животные</MenuItem>
                            <MenuItem value="Игры">Игры</MenuItem>
                            <MenuItem value="Люди и блоги">Люди и блоги</MenuItem>
                            <MenuItem value="Музыка">Музыка</MenuItem>
                            <MenuItem value="Наука и техника">Наука и техника</MenuItem>
                            <MenuItem value="Новости и политика">Новости и политика</MenuItem>
                            <MenuItem value="Образование">Образование</MenuItem>
                            <MenuItem value="Общественная деятельность">Общественная деятельность</MenuItem>
                            <MenuItem value="Путешествия">Путешествия</MenuItem>
                            <MenuItem value="Развлечения">Развлечения</MenuItem>
                            <MenuItem value="Спорт">Спорт</MenuItem>
                            <MenuItem value="Транспорт">Транспорт</MenuItem>
                            <MenuItem value="Фильмы и анимация">Фильмы и анимация</MenuItem>
                            <MenuItem value="Хобби и стиль">Хобби и стиль</MenuItem>
                            <MenuItem value="Юмор">Юмор</MenuItem>
                        </Select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography>Comments</Typography>
                        <span>Укажите, нужно ли показывать комментарии</span>
                        <RadioGroup value={allowComments} onChange={(e)=> setAllowComments(e.target.value)} defaultValue="true">
                            <FormControlLabel value={true} control={<Radio />} label="Разрешить комментарии" />
                            <FormControlLabel value={false} control={<Radio />} label="Запретить комментарии" />
                        </RadioGroup>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography>Access Status</Typography>
                        <span>Выберите вариант доступа к видео: открытый, по ссылке или ограниченный.</span>
                        <RadioGroup value={accessStatus} onChange={(e)=> setAccessStatus(e.target.value)} defaultValue="3">
                            <FormControlLabel value={3} control={<Radio />} label="Открытый доступ" />
                            <FormControlLabel value={2} control={<Radio />} label="Доступ по ссылке" />
                            <FormControlLabel value={1} control={<Radio />} label="Ограниченный доступ" />
                        </RadioGroup>
                    </div>
                </div>
                <div className="editvideo-right">
                    <div style={{ backgroundColor: "#ccc" }}>
                        <video className="next-video-thumbnail" src={`${config.backendUrl}/${video.video_url}`} controls/>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>Video's file</span>
                            <Typography>{video.video_url?.substring(7, video.video_url.length)}</Typography>
                        </div>
                    </div>
                </div>
            </div>
            <Divider/>
            <Button variant="contained" type="Submit" onClick={(e)=>{e.preventDefault(); handleSubmit()}}>Save changes</Button>
            <ThumbnailGenerator url={`${config.backendUrl}/${video.video_url}`}
            onGeneratedBlob={(blob)=> uploadService.upload(blob, "thumbnail").then(res=>setThumbnailUrl(res.result))}/>
        </form>
      </Dialog>
    )
}