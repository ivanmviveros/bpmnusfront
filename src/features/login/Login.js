import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import { setBackdropOpen, changeCurrentView } from 'features/frame/mainFrameSlice';
import { tryLogin } from './loginServices';
import { 
    enqueueSnackbar as enqueueSnackbarAction
} from 'features/frame/mainFrameSlice';

import { 
    setLoading, setLoggedIn, setToken
} from './loginSlice';
import { useDispatch } from 'react-redux';
import { changeUserName } from '../header/headerSlice';
import { errorHandleDefault, errorHandleForm } from 'utils';

export function LoginForm(){
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
    const dispatch = useDispatch();
    const [formData, setFormData] = React.useState({
        email: {value: '', error: false, helperText: ""},
        password: {value: '', error: false, helperText: ""},
        showPassword: false,
    }); 


    const login = (data) => {
        dispatch(setLoading('loading'));
        dispatch(setBackdropOpen(true));
        return async (dispatch) => {
            const response = await tryLogin(data)
            .then(
                (result) => {
                    if(result.data.user) {
                        const {username} = result.data.user;
                        let expires = new Date()
                        expires.setMinutes(expires.getMinutes() + 60*24); // timestamp
                        expires = new Date(expires); // Date object
                        const token = result.data.access_token;
                        document.cookie = `auth=${token}; expires=${expires};samesite=Lax`;
                        dispatch(changeUserName(username))
                        dispatch(setLoggedIn(true))
                        dispatch(setToken(token))
                        enqueueSnackbar({
                            key: new Date().getTime() + Math.random(),
                            message: `Ingreso correcto, bienvenido ${username}`,
                            options: {
                                variant: 'success'
                            },
                            dismissed: false
                        });
                        dispatch(changeCurrentView("projects"))
                    }
                }
            )
            .catch(
                (error) => {
                    if (error.response){
                        const nonFieldErrorsMessage = "Nombre de usuario o contraseña incorrectos";
                        if (errorHandleDefault(error.response, enqueueSnackbar)) return;
                        else setFormData(errorHandleForm(error.response, enqueueSnackbar, formData, nonFieldErrorsMessage))
                    }
                    else {
                        console.log('Aqui imprimo el error')
                    }
                }
            )
            .finally(
                () => {
                    dispatch(setBackdropOpen(false));
                    dispatch(setLoading('idle'));
                }
            )
        }
    }

    const handleClickShowPassword = () => {
        setFormData({
            ...formData,
            showPassword: !formData.showPassword,
        });
    };

    const handleLoginButtonClick = () => {
        const data = {
            "email": formData.email.value,
            "password": formData.password.value
        }
        dispatch(login(data))
    }

    const handleChange = (prop) => (event) => {
        setFormData({ ...formData, [prop]: { ...[prop], value: event.target.value }});
    };
    
    const EMAIL_REGEX =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <TextField
                            id="outlined-adornment-email"
                            type={'text'}
                            value={formData.email.value}
                            error={formData.email.error}
                            helperText={formData.email.helperText}
                            onChange={handleChange('email')}
                            label="Email"
                            inputProps={{ inputMode: 'email', pattern: EMAIL_REGEX }}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <TextField
                            id="outlined-adornment-password"
                            type={formData.showPassword ? 'text' : 'password'}
                            value={formData.password.value}
                            error={formData.password.error}
                            helperText={formData.password.helperText}
                            onChange={handleChange('password')}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                        >
                                        {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                            }}
                            label="Password"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <Button variant="contained" onClick={handleLoginButtonClick}>Login</Button>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    )
}