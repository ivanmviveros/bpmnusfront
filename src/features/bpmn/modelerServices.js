import axios from "axios";
import { API_URL, callApi } from "utils";

const APP = "modeler";

export const uploadDiagram = (data) => {
    var formData = new FormData();
    formData.append("image", data);
    
    const callback = (headers) => {
        headers['Content-Type'] = 'multipart/form-data'
        const url = `${API_URL}/${APP}/add`;
        return axios.post('url', formData, {
            headers: headers
        })
    }
    return callApi(callback);
}