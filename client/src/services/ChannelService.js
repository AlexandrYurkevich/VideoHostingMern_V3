import { config } from "../shared";
import axios from "axios";

const channelService = {
    getChannel: (channel_id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/channels/${channel_id}`)
            .then(res => {
                resolve({ channel: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    deleteChannel: (channel_id) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${config.backendUrl}/channels/${channel_id}`)
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    },
    getRecommendedChannels: (channel_ids) => {

    }
}

export default channelService;

