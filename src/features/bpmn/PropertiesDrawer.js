import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { TextField } from '@mui/material';

export default function PropertiesDrawer() {
    const show, setShow = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setShow(true);
    };

    return (
        <div>
            <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
            <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
            >
                <FormControl sx={{ m: 1}} variant="outlined">
                    <TextField
                        id="outlined-multiline-static"
                        label="Nombre"
                        defaultValue=""
                    />
                </FormControl>
                <FormControl sx={{ m: 1}} variant="outlined">
                    <TextField
                        id="outlined-multiline-static"
                        label="Descripcion"
                        multiline
                        rows={2}
                        defaultValue=""
                    />
                </FormControl>
            </Drawer>
        </div>
    );
}