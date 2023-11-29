import { config } from "../shared";
import axios from "axios";

const playlistService = {
    getPlaylist: (playlist_id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/playlists/${playlist_id}`)
            .then(res => {
                resolve({
                    playlist: res.data
                })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    getPlaylistVideos: (playlist_id, offset) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/playlists/videos`,{ params: {
                playlist_id,
                offset
            }})
            .then(res => {
                resolve({ videos: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    getPlaylistVideoIds: (playlist_id, offset) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/playlists/videoIds`,{ params: {
                playlist_id,
                offset
            }})
            .then(res => {
                resolve({ videos: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    getPlaylistsByChannel: (channel_id, offset) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/playlists/byChannel`,{ params: {
                channel_id,
                offset
            }})
            .then(res => {
                resolve({ playlists: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    deletePlaylist: (playlist_id) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${config.backendUrl}/playlists/${playlist_id}`)
            .then(res => {
                resolve({ playlist: res.data })
            })
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    },
    addPlaylist: (playlist_name, channel_id, start_videos) => {
        return new Promise((resolve, reject) => {
            axios.post(`${config.backendUrl}/playlists`, {playlist_name, channel_id, start_videos} )
            .then(res => {
                resolve({ playlist: res.data })
            })
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    }
    addVideosToPlaylist: (playlist_id, add_videos) => {
        return new Promise((resolve, reject) => {
            axios.post(`${config.backendUrl}/playlists/addVideos`, {playlist_id, add_videos} )
            .then(res => {
                resolve({ playlist: res.data })
            })
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    }
}

export default playlistService;

