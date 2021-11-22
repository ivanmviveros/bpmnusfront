import axios from "axios";

const API_URL = "http://localhost:8000";
const APP = "projects";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export const getToken = () => {
  const cookie = getCookie('auth');
  return cookie
}


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
