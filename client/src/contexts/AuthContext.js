import { createContext, useEffect, useState } from "react";
import authService from "../services/AuthService";

const start_user_id = JSON.parse(sessionStorage.getItem("reacttube-user"))
|| JSON.parse(localStorage.getItem("reacttube-user")) || null
const start_channel_id = JSON.parse(sessionStorage.getItem("reacttube-channel"))
|| JSON.parse(localStorage.getItem("reacttube-channel")) || null

export const AuthContext = createContext();
export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [channel, setChannel] = useState(undefined);

  useEffect(() => {
    if (start_user_id) { authService.loadStorageUser(start_user_id).then(res => setUser(res.user)) } else { setUser(null); }
    if (start_channel_id) { authService.loadStorageChannel(start_channel_id).then(res=>setChannel(res.channel)) } else { setChannel(null); }
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, setUser, channel, setChannel }} >
      {user!==undefined ? children : ""}
    </AuthContext.Provider>
  );
};
