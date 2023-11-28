import { config } from "../shared";
import axios from "axios";

const subscribeService = {
    addSubscribe: (channel_id, who) => {
        return new Promise((resolve, reject) => {
            axios.put(`${config.backendUrl}/subscribes`, {channel_id, who} )
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    },
    removeSubscribe: (channel_id, who) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${config.backendUrl}/subscribes`, {
                params: {channel_id, who}
            })
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    },
    isSubscribed: (sub_channel_id, who) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/subscribes/is_sub`, {
                params: {sub_channel_id, who}
            })
            .then(res => {
                resolve({ result: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    }
}

export default subscribeService;

