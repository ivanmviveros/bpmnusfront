import { messages } from 'messages';
import { 
    changeCurrentView
} from 'features/frame/mainFrameSlice';

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