import axios from "axios";
import { messages } from 'messages';
import { 
    changeCurrentView
} from 'features/frame/mainFrameSlice';

export const API_URL = process.env.API_HOST;

/**
 * @param {string} message 
 * @param {string} variant - error, success
 */
export const createEqueue = (message, variant) => ({
    key: new Date().getTime() + Math.random(),
    message: message,
    options: {
        variant: variant
    },
    dismissed: false
})

export const errorHandleDefault = (response, enqueueSnackbar, dispatch) => {
  let message;
  const status = response.status;
  if (status === 400) return false;
  else if (status === 401) message = messages.LOGIN_REQUIRED
  else if (status === 500) message = messages.INTERNAL_SERVER_ERROR;
  else if (status === 403) message = messages.ACCESS_DENIED;
  else console.log(status);
  if (message) enqueueSnackbar(createEqueue(message, 'error'));
  if (status === 401) dispatch(changeCurrentView(views.LOGIN));
  return true;
}

export const errorHandleForm = (response, enqueueSnackbar, formData, nonFieldErrorsMessage="") => {
  formData = {...formData};
  let message;
  const error_data = response.data
  if (error_data.non_field_errors) message = nonFieldErrorsMessage;
  else {
    message = "Error en los campos"
    for (const property in error_data) {
      formData = {
        ...formData,
        [property]: {
          ...formData[property],
          error: true,
          helperText: error_data[property][0]
        }
      };
    }
  }
  enqueueSnackbar(createEqueue(message, 'error'));
  return formData;
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