import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircle from '@mui/icons-material/AccountCircle';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import { tryLogin } from './loginServices';


import { 
    setLoading, setLoggedIn, setToken
} from './loginSlice';
import { useDispatch } from 'react-redux';
import { changeUserName } from '../header/headerSlice';

export function LoginForm(){
    const dispatch = useDispatch();
    const [values, setValues] = React.useState({
        email: '',
        password: '',
        showPassword: false,
    });

    const login = (data) => {
        dispatch(setLoading('loading'));
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
                    }
                }
            )
            .catch(
                (error) => {
                    console.log(error);
                }
            )
            .finally(
                () => {
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
            "email": values.email,
            "password": values.password
        }
        dispatch(login(data))
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    
    const EMAIL_REGEX =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-email">Email    </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email"
                            type={'text'}
                            value={values.email}
                            onChange={handleChange('email')}
                            label="Email"
                            inputProps={{ inputMode: 'email', pattern: EMAIL_REGEX }}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                                >
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
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