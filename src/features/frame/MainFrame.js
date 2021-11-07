import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../header/Header';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Projects} from '../projects/Projects';
import {selectCurrentView} from './mainFrameSlice';
import {LoginForm} from '../login/Login';
import { getToken, getUserFromToken, userIsGuest, userIsLogged } from '../login/loginServices';
import { setLoggedIn, setToken } from '../login/loginSlice'
import { changeUserName, changeUserImage } from '../header/headerSlice'


function renderSwitch(view){
    switch(view){
        case 'projects':
            return <Projects />
        case 'settings':
            return "Ajustes"
        case 'login':
            return <LoginForm />
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
                getUserFromToken(token).then(
                    data => {
                        if(data.user) dispatch(changeUserName(data.user.username))
                        if(data.user_image) dispatch(changeUserImage(data.user_image))
                    }
                ); 
            }
        }
    }
}

export function MainFrame() {
    const view = useSelector(selectCurrentView);
    const dispatch = useDispatch();
    dispatch(checkCredentials());
    

    return (
        <Box>
            <Header changeCurrentView />
            <Container maxWidth="xl">
                {
                    renderSwitch(view)
                }
            </Container>
        </Box>
    );
}
