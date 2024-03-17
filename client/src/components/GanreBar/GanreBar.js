import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { TagContext } from "../../contexts/TagContext";
import "./styles.css";

export default function GanreBar({video}) {
  const { user, channel } =  useContext(AuthContext);
  const { selectedTagsFilter, setSelectedTagsFilter, setSelectedTagsSort } = useContext(TagContext)
  const [tagsList, setTagsList] = useState([]);
  useEffect(()=>{
    setSelectedTagsFilter((prevFilter)=>{ return {...prevFilter, by_age: (Math.floor(((new Date()).getFullYear() - (new Date(user?.birthdate).getFullYear()))/31556952000))}})
  },[user])
  useEffect(()=>{
    setSelectedTagsFilter((prevFilter)=>{ return {...prevFilter, by_access: channel?._id}})
  },[channel])

  const handleTag = (tag) => {
    tagsList.includes(tag) ? setTagsList((prev)=>{ return prev.filter(t=> t!=tag)}) : setTagsList((prev)=>{return [...prev,tag]})
    setSelectedTagsFilter((prevFilter)=>{ return {...prevFilter, by_tags: tagsList}})
  }
  const handleChannel = (value) => {
    if(selectedTagsFilter.hasOwnProperty('by_channel')){ setSelectedTagsFilter((prevFilter)=>{ const { by_channel, ...rest} = prevFilter; return rest })}
    else{ setSelectedTagsFilter((prevFilter)=>{ return {...prevFilter, by_channel: value}}) }
  }
  const handleRecommend = (value) => {
    if(selectedTagsFilter.hasOwnProperty('by_recommend')){ console.log("by_rec del "); setSelectedTagsFilter((prevFilter)=>{ const { by_recommend, ...rest} = prevFilter; return rest })}
    else{ console.log("by_rec "); setSelectedTagsFilter((prevFilter)=>{ return {...prevFilter, by_recommend: value}}) }
  }
  const handleSimilar = (value) => {
    if(selectedTagsFilter.hasOwnProperty('by_similar')){ setSelectedTagsFilter((prevFilter)=>{ const{ by_similar, ...rest} = prevFilter; return rest })}
    else{ setSelectedTagsFilter((prevFilter)=>{ return {...prevFilter, by_similar: value}}) }
  }
  const handleCategory = (value) => {
    if(selectedTagsFilter.hasOwnProperty('by_category')){ setSelectedTagsFilter((prevFilter)=>{ const { by_category, ...rest} = prevFilter; return rest })}
    else{ setSelectedTagsFilter((prevFilter)=>{ return {...prevFilter, by_category: value} }) }
  }
  return (
    <div className="flex-ganre">
      <Button sx={{borderRadius:"20px",minWidth:"fit-content", color:"white"}} variant="contained"
      onClick={()=> {setSelectedTagsSort({})}}>Сначала старые</Button>
      <Button sx={{borderRadius:"20px",minWidth:"fit-content", color:"white"}} variant="contained"
      onClick={()=> {setSelectedTagsSort({createdAt: -1})}}>Сначала новые</Button>
      <Button sx={{borderRadius:"20px",minWidth:"fit-content", color:"white"}} variant="contained"
      onClick={()=> {setSelectedTagsSort({duration: 1})}}>Сортировать по длительности</Button>
      <Button sx={{borderRadius:"20px",minWidth:"fit-content", color:"white"}} variant="contained" color={selectedTagsFilter=={}?"primary":"secondary"}
      onClick={()=> {setSelectedTagsFilter({by_access: channel?._id, by_age: Math.floor(((new Date()) - user?.birthdate)/31556952000)})}}>All</Button>
      {video && <Button sx={{borderRadius:"20px",minWidth:"fit-content", color:"white"}} variant="contained" color={selectedTagsFilter.hasOwnProperty('by_channel')?"primary":"secondary"}
      onClick={()=> handleChannel(video.channel_id)}>Author: {video.channel.channel_name}</Button>}
      {channel && <Button sx={{borderRadius:"20px",minWidth:"fit-content", color:"white"}} variant="contained" color={selectedTagsFilter.hasOwnProperty('by_recommend')?"primary":"secondary"}
      onClick={()=> handleRecommend(channel._id)}>For you</Button>}
      {video && <Button sx={{borderRadius:"20px",minWidth:"fit-content", color:"white"}} variant="contained" color={selectedTagsFilter.hasOwnProperty('by_similar')?"primary":"secondary"}
      onClick={()=> handleSimilar(video._id)}>Similar</Button>}
      {video && video.tags?.map(tag =>{ return <Button sx={{borderRadius:"20px",minWidth:"fit-content", color:"white"}} variant="contained"
      color={tagsList.includes(tag)?"primary":"secondary"} onClick={()=>handleTag(tag)}>#{tag}</Button> })}
      {video?.category && <Button sx={{borderRadius:"20px",minWidth:"fit-content", color:"white"}} variant="contained" color={selectedTagsFilter.hasOwnProperty('by_category')?"primary":"secondary"}
      onClick={()=>handleCategory(video.category)}>{video.category}</Button>}
    </div>
  );
}