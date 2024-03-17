import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { ChannelProvider } from "./contexts/ChannelContext";
import { TagProvider } from "./contexts/TagContext";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from '@mui/material/styles';
const Home = React.lazy(() => import("./pages/Home/Home"));
const Login = React.lazy(() => import("./pages/Login/Login"));
const Register = React.lazy(() => import("./pages/Register/Register"));
const WatchVideo = React.lazy(() => import("./pages/WatchVideo/WatchVideo"));
const Channel = React.lazy(() => import("./pages/Channel/Channel"));
const SearchVideo = React.lazy(() => import("./pages/SearchVideo/SearchVideo"));
const History = React.lazy(() => import("./pages/History/History"));
const Subscribes = React.lazy(() => import("./pages/SubscribesVideo/SubscribesVideo"));
const Studio = React.lazy(() => import("./pages/Studio/Studio"));

const App = () => {
    const { user } = useContext(AuthContext);
    return (
        <ThemeProvider theme={createTheme({
            palette: {
              primary: { main: '#ff366f' },
              secondary: { main: '#ffb340' },
            },
          })}>
            <React.Suspense fallback={<>Loading...</>}>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={ <TagProvider><Home/></TagProvider> } />
                    <Route path="/login" element={ user ? <Navigate to="/" /> : <Login/> } />
                    <Route path="/register" element={ user ? <Navigate to="/" /> : <Register/> } />
                    <Route path="/search" element={ <TagProvider><SearchVideo/></TagProvider> } />

                    <Route path="/history" element={ user ? <History/> : <Navigate to="/login" />} />
                    <Route path="/subscribes" element={ user ? <Subscribes/> : <Navigate to="/login" />} />

                    <Route path="/channel/:channel_id" element={ <ChannelProvider><Channel/></ChannelProvider> } />
                    <Route path="/studio/:tab?" element={ true ? <Studio/> : <Navigate to="/login" /> } />
                    <Route path="/watch/:video_id/:playlist_id?/:playlist_order?" element={ <TagProvider><WatchVideo/></TagProvider> } />
                    <Route path="*" element={<>Not Found Template</>} />
                </Routes>
            </BrowserRouter>
            </React.Suspense>
        </ThemeProvider>
    )
}
export default App;