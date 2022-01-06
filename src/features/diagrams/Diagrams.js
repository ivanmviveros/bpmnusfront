import React from 'react';
import Grid  from '@mui/material/Grid';
import { Edit } from '@mui/icons-material';
import { views } from 'views';
import EnhancedTable from 'features/table/Table';
import {setHeaders, setApiName, setSelected} from '../table/tableSlice';
import { useDispatch, useSelector } from 'react-redux';
import { changeId } from 'features/bpmn/modelerSlice';
import { selectProject } from './diagramsSlice';

export function Diagrams() {
    const dispatch = useDispatch();
    const project = useSelector(selectProject);
    const MODULE_NAME = "diagrams";
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
            id: 'project',
            numeric: false,
            disablePadding: true,
            label: 'Proyecto',
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
                type: "Text", 
                options: {
                    "data_type": "text"
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

    const handleClickEdit = (event, name) => {
        dispatch(changeCurrentView(views.MODELER));
        dispatch(changeId(name));
    }

    const actions = [
        {  
            'icon': Edit,
            'action': handleClickEdit
        },
    ]
    
    React.useEffect(() => {
        dispatch(setApiName(MODULE_NAME));
        dispatch(setHeaders(HEADERS.map((header) => {
            return header.id != 'project' ? header : {
                ...header,
                filter_details: {
                    ...header.filter_details,
                    value: project
                }
            }
        })));
        dispatch(setSelected([]));
    }, [project]);
    
    return (
        <Grid container>
            <Grid item xs={12} sx={{ my: 2 }}>
                <EnhancedTable tittle="Diagramas" addView={views.MODELER} actions={actions} />
            </Grid>
        </Grid>
    )
}