import config from "../config";
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
    } 
}
export default userService;