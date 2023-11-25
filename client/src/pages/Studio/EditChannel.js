import { Avatar, Button, Tab, Tabs, TextField, Typography, useTheme } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { config } from "../../shared";

export default function EditChannel() {
    const { user, channel } = useContext(AuthContext);
    const [currentTab, setCurrentTab] = useState(0);
    const theme = useTheme();

    const [newName, setNewName] = useState(channel?.channel_name || "")
    const [newDesc, setNewDesc] = useState(channel?.channel_desc || "")
    return(
        <div>
            <Typography variant="h5">Channel Editing</Typography>
            <Tabs value={currentTab} onChange={(event, newValue) => {setCurrentTab(newValue)}} aria-label="editing tabs">
                <Tab label="Main Page"/>
                <Tab label="Branding"/>
                <Tab label="General Info"/>
            </Tabs>
            {currentTab == 0 &&
            <div></div>}
            {currentTab == 1 &&
            <div className="columned-container">
                <div style={{padding: '10px'}}>
                    <Typography>Channel's  Avatar</Typography>
                    <span>Avatar is shown near your videos or on your channel's page</span>
                    <div className="branding-container">
                        <div className="branding-avatar">
                        {channel?.avatar_url ? 
                            <Avatar sx={{ width: 160, height: 160 }} alt="ava" src={`${config.backendUrl}/${channel?.avatar_url}`}/> : 
                            <Avatar sx={{ bgcolor: channel?.avatar_color,width: 160, height: 160,fontSize: '80px' }}>{channel?.channel_name.charAt(0).toUpperCase()}</Avatar> 
                        }
                        </div>
                        <div className="columned-container">
                            <Typography>Use images less than 2 MB, take into account image stretching. It is recommended to use jpg and webp formats</Typography>
                            <div style={{'display':'flex'}}>
                                <Button variant="outlined">Edit</Button>
                                {channel?.avatar_url && <Button variant="outlined">Delete</Button>}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{padding: '10px'}}>
                    <Typography>Channel's  Banner</Typography>
                    <span>Banner is shown at the top of your channel's page</span>
                    <div className="branding-container">
                        <div className="branding-avatar">
                            <div style={{ display: "flex", backgroundColor: "white", border: "4px black solid", width: "50%",height: "80%"}}>
                                <div style={{ width: "100%", height: "20%", backgroundColor: theme.palette.primary.main }} />
                            </div>
                        </div>
                        <div className="columned-container">
                            <Typography>Use images less than 3 MB, it is recommended to use jpg and webp formats</Typography>
                            <div style={{'display':'flex'}}>
                                <Button variant="outlined">Edit</Button>
                                {channel?.avatar_url && <Button variant="outlined">Delete</Button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {currentTab == 2 &&
            <div className="columned-container">
                <div style={{padding: '10px'}}>
                    <Typography>Channel's name</Typography>
                    <span>Come up with a channel name that represents you and your videos.</span>
                    <TextField sx={{ width: '80%' }} type="text" required
                        value={newName} onChange={(event)=> setNewName(event.target.value)}
                    />
                </div>
                <div style={{padding: '10px'}}>
                    <Typography>Channel's description</Typography>
                    <TextField sx={{ width: '80%' }} type="text" multiline required inputProps={{ maxLength: 1000 }}
                        value={newDesc} onChange={(event)=> setNewDesc(event.target.value)}
                        helperText={`${newDesc.length}/1000`}
                        placeholder="Tell audience about your channel"
                    />
                </div>
            </div>}
        </div>
    )
}