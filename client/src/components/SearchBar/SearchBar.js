import { Autocomplete, debounce, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { config } from "../../shared";

export default function SearchBar() {
  const [currentPattern,setPattern] = useState("");
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);

  const handleInputChange = debounce(async (event) => {
    const inputValue = event.target.value;
    setPattern(inputValue)
    if (inputValue.trim() === '') { setOptions([]); return; }

    try {
      const response = await axios.get(`${config.backendUrl}/videos/searchRequests` ,{ params: { pattern: currentPattern } });;
      const requests = response.data;

      setOptions(requests);
    } catch (error) { console.log(error.message)}
  }, 300);

  return (
    <div  className="searchbar" role="search">
      <div className="input-box">
        <Autocomplete sx={{ width:'100%' }} freeSolo disableClearable
          options={options}
          renderInput={(params) => (
                <TextField {...params} sx={{ fontSize: 16, width:'100%' }} onChange={handleInputChange}
                onKeyUp={ (e)=> e.key == "Enter" && currentPattern && navigate("/search", {state:{pattern:currentPattern}})} placeholder="Input here" type="search"/>
          )}
        />
      </div>
      <button className="search-box" onClick={()=> currentPattern && navigate("/search", {state:{pattern:currentPattern}})}>
        <BsSearch className="search-img" alt="acc"/>
      </button>
    </div>
  );
};