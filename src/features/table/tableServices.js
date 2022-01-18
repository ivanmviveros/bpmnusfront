import axios from "axios";
import { API_URL, getToken } from "utils";

export const getList = (data, app) => {
  const token = getToken();
  const url = `${API_URL}/${app}/data_list`;
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

export const deleteBulk = (data, app) => {
  const token = getToken();
  const url = `${API_URL}/${app}/delete_bulk`;
  const headers = { Authorization: `Bearer ${token}` };
  axios.interceptors.response.use((response) => response, (error) => {
    return Promise.reject(error)
  })
  try {
    return axios.delete(url, {
      headers: headers,
      data: data
    });
  }
  catch{
    return Promise.reject('A network error occurred. ')
  }
};
