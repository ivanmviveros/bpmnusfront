import { messages } from 'messages';
import { 
    changeCurrentView
} from 'features/frame/mainFrameSlice';

export const API_URL = "http://localhost:8000";

export const errorHandleDefault = (error, enqueueSnackbar) => {
    if (error.response){
        const status = error.response.status;
        let message;
        if (status === 401) message = messages.LOGIN_REQUIRED
        else if (status === 500) message = messages.INTERNAL_SERVER_ERROR
        else if (status === 403) message = messages.ACCESS_DENIED
        enqueueSnackbar({
            key: new Date().getTime() + Math.random(),
            message: message,
            options: {
                variant: 'error'
            },
            dismissed: false
        });
        if (status === 401) dispatch(changeCurrentView(views.LOGIN))
    }
    else {
        console.log('Aqui imprimo el error')
    }
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

export const callApi = (callback) => {
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    axios.interceptors.response.use((response) => response, (error) => {
      return Promise.reject(error)
    })
    try {
      return callback(headers);
    }
    catch{
      return Promise.reject('A network error occurred. ')
    }
};