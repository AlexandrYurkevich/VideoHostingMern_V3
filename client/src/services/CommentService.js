import { config } from "../shared";
import axios from "axios";

const commentService = {
    getComment: (comment_id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/comments/${comment_id}`)
            .then(res => {
                resolve({
                    comment: res.data,
                    channel:res.data.channel
                })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    getCommentsByChannel: (channel_id, offset) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/comments/byChannel`,{ params: {
                channel_id,
                offset
            }})
            .then(res => {
                resolve({ comments: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    deleteComment: (comment_id) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${config.backendUrl}/comments/${comment_id}`)
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    }
}

export default commentService;

