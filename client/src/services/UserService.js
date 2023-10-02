import { config } from "../shared";
import axios from "axios";
const userService = {
    subscribe: (userId, channelId) => {
      return new Promise((resolve, reject) => {
        axios.put(`${config.backendUrl}/users/subscribe`, {
          userId,
          channelId
        })
        .then(res => {
          resolve({
            updatedUser: res.data.updatedUser,
            updatedChannel: res.data.updatedChannel
          });
        })
      })
    },
    addView: (userId, videoId) => {
      return new Promise((resolve, reject)=> {
        axios.put(`${config.backendUrl}/users/addview`, {
          userId,
          videoId
        })
        .then(res => {
          resolve({ updatedUser: res.data })
        })
        .catch(err => {
          reject(new Error(err.response.data.message));
        });
      })
    }
}
export default userService;