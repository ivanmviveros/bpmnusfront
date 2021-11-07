
import axios from 'axios';
import { store } from '../../app/store';
const API_URL = 'http://localhost:8000';
const APP = "dj-rest-auth"

const http = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
      "Content-type": "application/json"
    }
});


export const tryLogin = (data) => {
    const url = `${API_URL}/${APP}/login/`;
    return http.post(url, data)
}

export const getUserFromToken = async (token) => {
    const url = `${API_URL}/usersapi/get_user_from_token`;
    const data = {"token": token}
    try {
        const response = await http.post(url, data);
        return response.data;
    } catch (error) {
        return null;
    }
}

export const userIsGuest = () => {
    const userName = store.getState().header.userName;
    return userName === 'Guest';
}

export const userIsLogged = () => {
    const loggedIn = store.getState().login.loggedIn;
    return loggedIn
}

export const getTokenFromStore = () => {
    return store.getState().login.token;
}

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
