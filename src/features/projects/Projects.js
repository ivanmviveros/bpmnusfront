import React from 'react';
import Grid  from '@mui/material/Grid';
import EnhancedTable from '../table/Table';
import {setHeaders, setApiName} from '../table/tableSlice';
import { useDispatch } from 'react-redux';

export function Projects(props) {
    const dispatch = useDispatch();
    const MODULE_NAME = "projects";
    const HEADERS = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'Código',
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
        },
        {
            id: 'desc',
            numeric: false,
            disablePadding: false,
            label: 'Descripción',
        },
        {
            id: 'creation_date',
            numeric: false,
            disablePadding: false,
            label: 'Fecha de creación',
        },
    ];
    
    dispatch(setApiName(MODULE_NAME));
    dispatch(setHeaders(HEADERS));
    
    return (
        <Grid container>
            <Grid item xs={12}>
                <EnhancedTable headers={HEADERS} />
            </Grid>
        </Grid>
    )
}