import { Alert, Backdrop, Button, CircularProgress, Dialog, Divider, FormControlLabel, IconButton, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { config } from "../../shared";
import SelectVideos from "./SelectVideos";
import playlistService from "../../services/PlaylistService";

export default function AddPlaylist({open, onClose, onComplete}){
    const { user, channel } = useContext(AuthContext);
    const [isLoading, setLoading] = useState(false);
    const [isSelectOpen, setSelectOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [selectedList, setSelectedList] = useState([]);
    const [accessStatus, setAccessStatus] = useState(3);
    const [loadingFinished, setLoadingFinished] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        playlistService.addPlaylist(newName, newDesc, accessStatus, channel._id, selectedList.map(p=>p._id)).then(res=>{onComplete(res.playlist); onClose();}).finally(setLoading(false))
    }
    useEffect(()=>{
        setLoading(false);
        setLoadingFinished(false);
        setSelectedList([]);
    },[]);

    return(
      <Dialog open={open} onClose={onClose}>
        {loadingFinished ? <Alert onClose={onClose}>Playlist successfully created.</Alert> :
        <form className="loadvideo-container" onSubmit={(e)=> handleSubmit(e)}>
            <div className="between-header">
                <Typography variant="h5">Add Playlist</Typography>
                <IconButton onClick={onClose}><CloseIcon/></IconButton>
            </div>
            <Divider/>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <TextField label="Playlist Name" sx={{width:"100%"}} required value={newName} onChange={(e)=> setNewName(e.target.value)}></TextField>
                <TextField type="text" sx={{width:"100%"}} multiline inputProps={{ maxLength: 1000 }} value={newDesc} onChange={(event)=> setNewDesc(event.target.value)}
                helperText={`${newDesc?.length}/1000`} placeholder="Describe your playlist"></TextField>
                <Divider/>
                <div style={{display: "flex",flexDirection: "column", maxWidth:"50vw", overflowX: "auto" }} >
                    <Typography>Selected Videos</Typography>
                    <span>Выберите видео, которые хотите включить в плейлист.</span>
                    { selectedList.length == 0 ?
                    <IconButton sx={{maxWidth:"fit-content"}} onClick={()=>setSelectOpen(true)}>
                        <AddIcon/>
                    </IconButton> :
                    <div className="thumb-list" style={{}}>
                        {selectedList.map(video=>(
                            <img className="video-manage-thumbnail" src={`${config.backendUrl}/${video.thumbnail_url}`}/>
                        ))}
                    </div>}
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography>Access Status</Typography>
                <span>Выберите вариант доступа к плейлисту: открытый, по ссылке или ограниченный.</span>
                <RadioGroup value={accessStatus} onChange={(e)=> setAccessStatus(e.target.value)} defaultValue="3">
                    <FormControlLabel value={3} control={<Radio />} label="Открытый доступ" />
                    <FormControlLabel value={2} control={<Radio />} label="Доступ по ссылке" />
                    <FormControlLabel value={1} control={<Radio />} label="Ограниченный доступ" />
                </RadioGroup>
            </div>
            <Button variant="contained" type="submit" disabled={selectedList.length == 0}>Add playlist</Button>
        </form>}
        <SelectVideos open={isSelectOpen} onClose={()=>setSelectOpen(false)} handleSelection={(v)=> setSelectedList(v)}/>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
            <CircularProgress color="secondary" />
        </Backdrop>
      </Dialog>
    )
}