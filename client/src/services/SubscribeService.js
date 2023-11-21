import { config } from "../shared";
import axios from "axios";

const subscribeService = {
    getSubscribersCount: (channel_id) =>{
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/subscribes/count/${channel_id}`)
            .then(res => {
                resolve({ count: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
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

