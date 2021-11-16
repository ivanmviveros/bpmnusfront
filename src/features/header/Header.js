import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import Drawer from '@mui/material/Drawer';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { deepOrange } from '@mui/material/colors';
import { views } from 'views';
import {changeCurrentView} from '../frame/mainFrameSlice'
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUserName,
    selectTittle,
    selectUserImage
} from './headerSlice';



export function Header(props) {

    const dispatch = useDispatch();
    const tittle = useSelector(selectTittle);
    const userName = useSelector(selectUserName);
    const userImage = useSelector(selectUserImage);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
      setOpen(true);
    };
    
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const handleLoginClick = () => {
        setAnchorEl(null);
        dispatch(changeCurrentView(views.LOGIN));
    }


    const menuItems = [
        {label: "Proyectos", icon: <FolderIcon />, view: views.PROJECTS}, 
        {label: "Ajustes", icon: <SettingsIcon />, view: views.SETTINGS}, 
    ];
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        aria-controls="menu-appbar"
                        sx={{ mr: 2 }}
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        variant="persistent"
                        anchor="left"
                        open={open}
                    >
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                        
                        {menuItems.map((item, index) => (
                            <ListItem button key={item.label} onClick={() => dispatch(changeCurrentView(item.view))}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </Drawer>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {tittle}
                    </Typography>
                    
                    
                    <Button 
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-user"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        startIcon= {userImage ? <Avatar alt="Remy Sharp" src={userImage} /> : (
                                userName === "guest" ? <AccountCircle /> : 
                                <Avatar sx={{ bgcolor: deepOrange[500] }}>
                                    {userName.charAt(0)}
                                </Avatar>
                            )
                        }
                    >
                        {userName}
                    </Button >
                    
                    <Menu
                        id="menu-user"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {userName === 'Guest' ? <MenuItem onClick={handleLoginClick}>Login</MenuItem> : <MenuItem onClick={handleClose}>Profile</MenuItem> }
                        {userName === 'Guest' ? "" : <MenuItem onClick={handleClose}>My account</MenuItem> }
                        {userName === 'Guest' ? "" : <MenuItem onClick={handleClose}>Logout</MenuItem> }
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    );
}