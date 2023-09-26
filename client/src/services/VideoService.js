import config from "../config";
import axios from "axios";

const videoService = {
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
    }
}

export default videoService;

