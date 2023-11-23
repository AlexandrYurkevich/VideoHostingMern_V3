import { config } from "../shared";
import axios from "axios";

const sharedService = {
    upload: (file, destination) => {
        let formData = new FormData();
        formData.append(destination, file);
        return new Promise((resolve, reject) => {
            axios.post(`${config.backendUrl}/upload/${destination}`, formData,{
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(res=> {
                resolve({result: res.data})
            })
            .catch (err => {
                reject(new Error(err.response.data.message));
            })
        })
    }
}

export default sharedService;

