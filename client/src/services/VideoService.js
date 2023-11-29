import { config } from "../shared";
import axios from "axios";

const videoService = {
    getVideo: (video_id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/videos/${video_id}`)
            .then(res => {
                resolve({
                    video: res.data,
                    channel:res.data.channel
                })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    getVideosByChannel: (channel_id, offset, access=false) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/videos/byChannel`,{ params: {channel_id,offset,access}})
            .then(res => {
                resolve({ videos: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    getVideos: (filter, sort, offset) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/videos/filter`,{ params: { filter, sort, offset }})
            .then(res => {
                resolve({ videos: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    deleteVideo: (video_id) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${config.backendUrl}/videos/${video_id}`)
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    },
    loadVideo: (video_properties) => {
        return new Promise((resolve, reject) => {
            axios.post(`${config.backendUrl}/videos`, video_properties)
            .then(res => {
                resolve({newVideo: res.data})
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    addView: (video_id, channel_id) => {
        return new Promise((resolve, reject) => {
            axios.post(`${config.backendUrl}/videos/addView`, {video_id, channel_id})
            .then(res => {
                resolve({data: res.data})
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    editVideo: (video_id, video_properties) => {
        return new Promise((resolve, reject) => {
            axios.put(`${config.backendUrl}/videos/editVideo/${video_id}`, video_properties)
            .then(res => {
                resolve({updatedVideo: res.data})
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    editThumbnail: ({video_id, new_url}) => {
        return new Promise((resolve, reject) => {
            axios.put(`${config.backendUrl}/videos/editThumbnail/${video_id}`, new_url)
            .then(res => {
                resolve({updatedVideo: res.data})
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    }
}

export default videoService;

