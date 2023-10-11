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
    getVideosByChannel: (channel_id, offset) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/videos/byChannel/${channel_id}/${offset}`)
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
    }
}

export default videoService;

