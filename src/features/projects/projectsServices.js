import axios from "axios";
import { API_URL, callApi } from "utils";

const APP = "projects";

export const addProject = (data) => {
    const callback = (headers) => {
        const url = `${API_URL}/${APP}/add`;
        return axios.post(url, data, { headers: headers});
    }
    return callApi(callback);
}

export const replaceProject = (data, id) => {
    const callback = (headers) => {
        const url = `${API_URL}/${APP}/replace/${id}`;
        return axios.put(url, data, { headers: headers});
    }
    return callApi(callback);
}

export const getProject = (id) => {
    const callback = (headers) => {
        const url = `${API_URL}/${APP}/get/${id}`;
        return axios.get(url, { headers: headers});
    }
    return callApi(callback);
}