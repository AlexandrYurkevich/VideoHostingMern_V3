import { config } from "../shared";
import axios from "axios";

const likeService = {
    tryLike: (channel_id, video_id=null,comment_id=null) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/likes/tryLike`, {params: {
                channel_id, video_id, comment_id
            }})
            .then(res => {
                resolve({
                    updatedState: res.data
                })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    tryDislike: (channel_id, video_id=null,comment_id=null) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/likes/tryDislike`, {params: {
                channel_id, video_id, comment_id
            }})
            .then(res => {
                resolve({
                    updatedState: res.data
                })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    isLikedByChannel: (video_id, channel_id)=> {

    },
    isDislikedByChannel: (video_id, channel_id)=> {

    }
}

export default likeService;

