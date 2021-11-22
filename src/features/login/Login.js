import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';
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

export function LoginForm(){
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
    const dispatch = useDispatch();
    const [values, setValues] = React.useState({
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
                        const status = error.response.status;
                        let message;
                        if (error.response.data.non_field_errors) message = "Nombre de usuario o contraseña incorrectos"
                        else {
                            const error_data = error.response.data
                            message = "Error en los campos"
                            console.log(error_data)
                            setValues(
                                {
                                    ...values,
                                    email: {
                                        ...values.email, 
                                        error: error_data.email ? true : false,  
                                        helperText: error_data.email ? error_data.email[0] : ''
                                    },
                                    password: {
                                        ...values.password, 
                                        error: error_data.password ? true : false,  
                                        helperText: error_data.password ? error_data.password[0] : ''
                                    }
                                }
                            )
                        }  
                        enqueueSnackbar({
                          key: new Date().getTime() + Math.random(),
                          message: message,
                          options: {
                              variant: 'error'
                          },
                          dismissed: false
                        });
                        if (status === 401) dispatch(changeCurrentView(views.LOGIN))
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
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleLoginButtonClick = () => {
        const data = {
            "email": values.email.value,
            "password": values.password.value
        }
        dispatch(login(data))
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: { ...[prop], value: event.target.value }});
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
                            value={values.email.value}
                            error={values.email.error}
                            helperText={values.email.helperText}
                            onChange={handleChange('email')}
                            label="Email"
                            inputProps={{ inputMode: 'email', pattern: EMAIL_REGEX }}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <TextField
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password.value}
                            error={values.password.error}
                            helperText={values.password.helperText}
                            onChange={handleChange('password')}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                        >
                                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
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