import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Tooltip, Grid, InputLabel, Select, MenuItem } from '@mui/material';

import { changeArtifactPropierties, selectDiagramPropierties } from './modelerSlice';


export default function PropertiesDrawer(props) {
    const { selectedItem, updateSelectedLabel } = props;
    const dispatch = useDispatch();
    const diagramPropierties = useSelector(selectDiagramPropierties);
    const name = diagramPropierties[selectedItem] ? diagramPropierties[selectedItem].name : '';
    const desc = diagramPropierties[selectedItem] ? diagramPropierties[selectedItem].desc : '';
    const restrictions = diagramPropierties[selectedItem] ? diagramPropierties[selectedItem].restrictions : '';
    const criteria = diagramPropierties[selectedItem] ? diagramPropierties[selectedItem].criteria : '';
    const priority = diagramPropierties[selectedItem] ? diagramPropierties[selectedItem].priority : '';
    const points = diagramPropierties[selectedItem] ? diagramPropierties[selectedItem].points : '';
    const anchor =  selectedItem == '' ? false : true;

    const onChangeProp = (propierty) => (e) => {
        dispatch(changeArtifactPropierties({
            id: selectedItem,
            propierty: propierty,
            value: e.target.value
        }));
        if(propierty == 'name') updateSelectedLabel.f(e.target.value);
    }
    

    return (
        <div>
            <Drawer
                anchor={'bottom'}
                open={anchor}
                variant="persistent"
            >
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <FormControl fullWidth sx={{ m: 1}} variant="outlined">
                            <Tooltip title="Normalmente un verbo en infinitivo" placement="top">
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Nombre"
                                    value={name}
                                    onChange={onChangeProp("name")}
                                />
                            </Tooltip>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl sx={{ m: 1, width:"97%" }} variant="outlined">
                            <InputLabel id="priority-label">Prioridad</InputLabel>
                            <Tooltip title="Normalmente un numero de la serie fibonacci" placement="top">
                                <Select
                                    labelId="priority-label"
                                    value={priority}
                                    label="Prioridad"
                                    onChange={onChangeProp("priority")}
                                >
                                    <MenuItem value={'Baja'}>Baja</MenuItem>
                                    <MenuItem value={'Media'}>Media</MenuItem>
                                    <MenuItem value={'Alta'}>Alta</MenuItem>
                                </Select>
                            </Tooltip>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl sx={{ m: 1, width:"97%" }} variant="outlined">
                            <InputLabel id="points-label">Puntos</InputLabel>
                            <Tooltip title="Normalmente un numero de la serie fibonacci" placement="top">
                                <Select
                                    labelId="points-label"
                                    value={points}
                                    label="Puntos"
                                    onChange={onChangeProp("points")}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={13}>13</MenuItem>
                                    <MenuItem value={21}>21</MenuItem>
                                </Select>
                            </Tooltip>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <FormControl fullWidth sx={{ m: 1}} variant="outlined">
                            <Tooltip title="Describa el proceso" placement="top">
                            <TextField
                                label="Proposito"
                                multiline
                                rows={3}
                                value={desc}
                                onChange={onChangeProp("desc")}
                            />
                            </Tooltip>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth sx={{ m: 1}} variant="outlined">
                            <Tooltip title="Que tipo de acciones deben impedirse" placement="top">
                            <TextField
                                label="Restricciones"
                                multiline
                                rows={3}
                                value={restrictions}
                                onChange={onChangeProp("restrictions")}
                            />
                            </Tooltip>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth sx={{ m: 1}} variant="outlined">
                            <Tooltip title="Que cosas deben pasar para que se acepte esta historia" placement="top">
                            <TextField
                                label="Criterios de aceptación"
                                multiline
                                rows={3}
                                value={criteria}
                                onChange={onChangeProp("criteria")}
                            />
                            </Tooltip>
                        </FormControl>
                    </Grid>
                </Grid>
                
                
                
            </Drawer>
        </div>
    );
}