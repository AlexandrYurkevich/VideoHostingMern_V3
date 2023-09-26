import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import WatchVideo from "./pages/WatchVideo/WatchVideo"
import Channel from "./pages/Channel/Channel"
import { ChannelProvider } from "./contexts/ChannelContext"
import { TagProvider } from "./contexts/TagContext";
import SearchVideo from "./pages/SearchVideo/SearchVideo";
import History from "./pages/History/History"
import Subscribes from "./pages/SubscribesVideo/SubscribesVideo"

const App = () => {
    const { user } = useContext(AuthContext);
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={ <TagProvider><Home/></TagProvider> } />
                <Route path="/login" element={ user ? <Navigate to="/" /> : <Login/> } />
                <Route path="/register" element={ user ? <Navigate to="/" /> : <Register/> } />
                <Route path="/search" element={ <TagProvider><SearchVideo/></TagProvider> } />

                <Route path="/history" element={ <History/> } />
                <Route path="/subscribes" element={ <Subscribes/> } />

                <Route path="/channel/:id" element={ <ChannelProvider><Channel/></ChannelProvider> } />
                <Route path="/watch/:id" element={ <TagProvider><WatchVideo/></TagProvider> } />
            </Routes>
        </BrowserRouter>
    )
}
export default App;