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
    getRecommendedChannels: (channel_id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${config.backendUrl}/channels/recommend/${channel_id}`)
            .then(res => {
                resolve({ recommended_channels: res.data })
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    },
    addRecommendedChannel: (channel_id, recommended_id) => {
        return new Promise((resolve, reject)=> {
            axios.put(`${config.backendUrl}/channels/addRecommend/${channel_id}`, {recommended_id})
            .then(res => { resolve({updatedChannel: res.data}) })
            .catch(err => { reject(new Error(err.response.data.message)) })
        })
    },
    removeRecommendedChannel: (channel_id, recommended_id) => {
        return new Promise((resolve, reject) => {
            axios.put(`${config.backendUrl}/channels/removeRecommend`, { channel_id, recommended_id })
            .catch(err => {
                reject(new Error(err.response.data.message))
            })
        })
    },
    editChannel: (channel_id, form) => {
        return new Promise((resolve, reject)=> {
            axios.put(`${config.backendUrl}/channels/edit/${channel_id}`, form)
            .then(res => { resolve({updatedChannel: res.data}) })
            .catch(err => { reject(new Error(err.response.data.message)) })
        })
    },
    editAvatar: (channel_id, new_url) => {
        return new Promise((resolve, reject)=> {
            axios.put(`${config.backendUrl}/channels/editAvatar/${channel_id}`, {new_url})
            .then(res => { resolve({new_url}) })
            .catch(err => { reject(new Error(err.response.data.message)) })
        })
    },
    editBanner: (channel_id, new_url) => {
        return new Promise((resolve, reject)=> {
            axios.put(`${config.backendUrl}/channels/editBanner/${channel_id}`, {new_url})
            .then(res => { resolve({new_url}) })
            .catch(err => { reject(new Error(err.response.data.message)) })
        })
    }
}

export default channelService;

