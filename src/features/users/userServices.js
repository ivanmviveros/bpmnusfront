import axios from 'axios';
const API_URL = 'http://localhost:8000';

const APP = "usersapi"

export const getProjectsList = (data) => {
    const url = `${API_URL}/${APP}/data_list`;
    return axios.post(url, data)
}
