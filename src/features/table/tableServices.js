import axios from "axios";
import { API_URL, getToken } from "utils";

const APP = "projects";

export const getProjectsList = (data) => {
  const token = getToken();
  const url = `${API_URL}/${APP}/data_list`;
  const headers = { Authorization: `Bearer ${token}` };
  axios.interceptors.response.use((response) => response, (error) => {
    return Promise.reject(error)
  })
  try {
    return axios.post(url, data, { headers: headers});
  }
  catch{
    return Promise.reject('A network error occurred. ')
  }
};

export const deleteBulk = (data) => {
  const token = getToken();
  const url = `${API_URL}/${APP}/delete_bulk`;
  const headers = { Authorization: `Bearer ${token}` };
  axios.interceptors.response.use((response) => response, (error) => {
    return Promise.reject(error)
  })
  try {
    return axios.delete(url, data, { headers: headers});
  }
  catch{
    return Promise.reject('A network error occurred. ')
  }
};
