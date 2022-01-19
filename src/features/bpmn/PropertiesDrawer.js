import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Tooltip } from '@mui/material';
import { changeArtifactPropierties, selectDiagramPropierties } from './modelerSlice';


export default function PropertiesDrawer(props) {
    const { selectedItem, updateSelectedLabel } = props;
    const dispatch = useDispatch();
    const diagramPropierties = useSelector(selectDiagramPropierties);
    const name = diagramPropierties[selectedItem] ? diagramPropierties[selectedItem].name : '';
    const desc = diagramPropierties[selectedItem] ? diagramPropierties[selectedItem].desc : '';
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
                <FormControl sx={{ m: 1}} variant="outlined">
                    <Tooltip title="Normalmente un verbo en infinitivo" placement="top">
                        <TextField
                            id="outlined-multiline-static"
                            label="Nombre"
                            value={name}
                            onChange={onChangeProp("name")}
                        />
                    </Tooltip>
                </FormControl>
                <FormControl sx={{ m: 1}} variant="outlined">
                    <Tooltip title="Describa el proceso" placement="top">
                    <TextField
                        id="outlined-multiline-static"
                        label="Proposito"
                        multiline
                        rows={2}
                        value={desc}
                        onChange={onChangeProp("desc")}
                    />
                    </Tooltip>
                </FormControl>
            </Drawer>
        </div>
    );
}