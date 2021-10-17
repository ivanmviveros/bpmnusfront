import React from 'react';
import { useSelector } from 'react-redux';
import { Header } from '../header/Header';
import Container from '@mui/material/Container';
import Grid  from '@mui/material/Grid';
import {selectCurrentView} from './mainFrameSlice';

function renderSwitch(view){
    switch(view){
        case 'projects':
            return "Proyectos"
        case 'settings':
            return "Ajustes"
    }
}

export function MainFrame() {
    const view = useSelector(selectCurrentView);

    return (
        <Container>
            <Header changeCurrentView />
            <Grid container>
                <Grid item xs={12}>
                    {
                        renderSwitch(view)
                    }
                </Grid>
            </Grid>
        </Container>
    );
}
