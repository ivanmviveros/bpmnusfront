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
            filterable: true,
            filter_details: {
                type: "Text", //Text, Range, Picker
                options: {
                    "data_type": "number" //Min, Max range, picker_list, data_type (number, text, date)
                },
                value: '',
                value2: ''
            }
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            filterable: true,
            filter_details: {
                type: "Picker", 
                options: {
                    "data_type": "text",
                    picker_list: [
                        {
                            key: 1,
                            label: '1'
                        },
                        {
                            key: 2,
                            label: '2'
                        }
                    ]
                },
                value: '',
                value2: ''
            }
        },
        {
            id: 'desc',
            numeric: false,
            disablePadding: false,
            label: 'Descripción',
            filterable: true,
            filter_details: {
                type: "Text", 
                options: {
                    "data_type": "text"
                },
                value: '',
                value2: ''
            }
        },
        {
            id: 'creation_date',
            numeric: false,
            disablePadding: false,
            label: 'Fecha de creación',
            filterable: true,
            filter_details: {
                type: "Range", 
                options: {
                    "data_type": "date"
                },
                value: '',
                value2: ''
            }
        },
    ];
    
    React.useEffect(() => {
        dispatch(setApiName(MODULE_NAME));
        dispatch(setHeaders(HEADERS));
    }, []);
    
    return (
        <Grid container>
            <Grid item xs={12} sx={{ my: 2 }}>
                <EnhancedTable tittle="Proyectos" />
            </Grid>
        </Grid>
    )
}