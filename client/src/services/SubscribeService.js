import { config } from "../shared";
import axios from "axios";

const subscribeService = {
    getVideo: (subscribe_id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/subscribes/${subscribe_id}`)
            .then(res => {
                resolve({
                    subscribe: res.data,
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
            axios.get(`${config.backendUrl}/subscribes/byChannel`,{ params: {
                channel_id,
                offset
            }})
            .then(res => {
                resolve({ subscribes: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    deleteVideo: (subscribe_id) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${config.backendUrl}/subscribes/${subscribe_id}`)
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    }
}

export default subscribeService;

