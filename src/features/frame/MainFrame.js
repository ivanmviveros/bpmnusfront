import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../header/Header';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import useNotifier from 'useNotifier';
import { views } from 'views';
import {Projects} from '../projects/Projects';
import {selectCurrentView, selectBackdropOpen} from './mainFrameSlice';
import {LoginForm} from '../login/Login';
import { getToken, getUserFromToken, userIsGuest, userIsLogged } from '../login/loginServices';
import { setLoggedIn, setToken } from '../login/loginSlice'
import { changeUserName, changeUserImage } from '../header/headerSlice'
import { ProjectsForm } from 'features/projects/ProjectsForm';
import Modeler from 'features/bpmn/Modeler';


function renderSwitch(view){
    switch(view){
        case views.PROJECTS:
            return <Projects />
        case views.SETTINGS:
            return "Ajustes"
        case views.LOGIN:
            return <LoginForm />
        case views.PROJECTS_FORM:
            return <ProjectsForm />
        case views.MODELER:
            return <Modeler />
    }
}

function checkCredentials(){
    return function(dispatch){
        const token = getToken();
        if(token !== null){
            if (!userIsLogged()){
                dispatch(setLoggedIn(true));
                dispatch(setToken(token));
            }
            if(userIsGuest()){
                getUserFromToken(token)
                .then(
                    data => {
                        if(data){
                            if(data.user) dispatch(changeUserName(data.user.username))
                            if(data.user_image) dispatch(changeUserImage(data.user_image))
                        }       
                    }
                )
                .catch(
                    error => {
                        if (error.response){
                            const status = error.response.status;
                            let message;
                            if (status === 500) message = messages.INTERNAL_SERVER_ERROR
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
                            console.log(error)
                        }
                    }
                )
            }
        }
    }
}

export function MainFrame() {
    useNotifier();
    const view = useSelector(selectCurrentView);
    const backdropOpen = useSelector(selectBackdropOpen);
    const dispatch = useDispatch();
    dispatch(checkCredentials());
    

    return (
        <div>
            <Box>
                <Header changeCurrentView />
                <Container maxWidth="xl">
                    {
                        renderSwitch(view)
                    }
                </Container>
            </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
