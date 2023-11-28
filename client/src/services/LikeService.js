import { config } from "../shared";
import axios from "axios";

const likeService = {
    addLike: (video_id,comment_id, channel_id) => {
        return new Promise((resolve, reject) => {
            axios.post(`${config.backendUrl}/likes`, {video_id, comment_id, channel_id, is_dislike:false} )
            .then(res => {
                resolve({ result: res.data })
            })
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    },
    addDislike: (video_id,comment_id, channel_id) => {
        return new Promise((resolve, reject) => {
            axios.post(`${config.backendUrl}/likes`, {video_id,comment_id, channel_id, is_dislike: true} )
            .then(res => {
                resolve({ result: res.data })
            })
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    },
    removeLike: (video_id,comment_id, channel_id) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${config.backendUrl}/likes`, {
                params: {video_id,comment_id, channel_id, is_dislike:false}
            })
            .then(res => {
                resolve({ result: res.data })
            })
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    },
    removeDislike: (video_id,comment_id, channel_id) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${config.backendUrl}/likes`, {
                params: {video_id,comment_id, channel_id, is_dislike:true }
            })
            .then(res => {
                resolve({ result: res.data })
            })
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    },
    isLiked: (video_id,comment_id, channel_id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/likes/is_liked`, {
                params: {video_id,comment_id, channel_id, is_dislike:false}
            })
            .then(res => {
                resolve({ result: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    isDisliked: (video_id, comment_id, channel_id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/likes/is_liked`, {
                params: {video_id,comment_id, channel_id, is_dislike: true}
            })
            .then(res => {
                resolve({ result: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    getLikedVideos: (channel_id, offset) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/likes/videos`,{ params: {
                channel_id,
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
}

export default likeService;

