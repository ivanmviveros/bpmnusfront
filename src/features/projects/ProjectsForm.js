import { Button, FormControl, Stack, TextField, Box } from "@mui/material"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { 
    setBackdropOpen,
    enqueueSnackbar as enqueueSnackbarAction
} from 'features/frame/mainFrameSlice';
import { errorHandleDefault, errorHandleForm } from 'utils';
import { selectFormData, selectId, setFormData, setId } from "./projectFormSlice"
import { addProject, getProject } from "./projectsServices";
import { changeTittle } from "features/header/headerSlice";



export const ProjectsForm = () => {
    const id  = useSelector(selectId);
    const formData = useSelector(selectFormData);
    const dispatch = useDispatch();
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
    const title = id ? 'Editar proyecto' : 'Crear proyecto';

    const handleChange = (prop) => (event) => {
        dispatch(setFormData({
            ...formData,
            [prop]: {
                ...formData[prop],
                value: event.target.value
            }
        }))
    };

    const getProjectData = (id) => {
        if (id !== undefined) {
            dispatch(setBackdropOpen(true))
            return async (dispatch) => {
                await getProject(id)
                .then((result) => {
                    data = {
                        name: {value: result.data.name, error: false, helperText: ""},
                        desc: {value: result.data.desc, error: false, helperText: ""}
                    }
                    dispatch(setFormData(data));
                })
                .catch((error) => {
                    if (error.response){
                        const nonFieldErrorsMessage = "Nombre de usuario o contraseña incorrectos";
                        if (errorHandleDefault(error.response, enqueueSnackbar)) return;
                    }
                    else {
                        console.log('Aqui imprimo el error');
                        console.log(console.error());
                    }
                    dispatch(setBackdropOpen(false))
                })
                .finally(() => {
                    dispatch(setBackdropOpen(false))
                })
            }
        }
    }

    const formatForm = () => {
        return {
            name: formData.name.value,
            desc: formData.desc.value
        }
    }

    const createProject = () => {
        dispatch(setBackdropOpen(true));
        return async (dispatch) => {
            const data = formatForm()
            await addProject(data)
            .then((result) => {
                console.log(result);
                enqueueSnackbar({
                    key: new Date().getTime() + Math.random(),
                    message: `Proyecto creado correctamente`,
                    options: {
                        variant: 'success'
                    },
                    dismissed: false
                });
                dispatch(setFormData({
                    name: {
                        value: '', error: false,
                        value: data.name
                    },
                    desc: {
                        value: '', error: false,
                        value: data.desc
                    },
                })),
                dispatch(setId(result.data.id))
            })
            .catch((error) => {
                if (error.response){
                    const nonFieldErrorsMessage = "Nombre de usuario o contraseña incorrectos";
                    if (errorHandleDefault(error.response, enqueueSnackbar)) return;
                    else dispatch(setFormData(errorHandleForm(error.response, enqueueSnackbar, formData, nonFieldErrorsMessage)));
                }
                else {
                    console.log('Aqui imprimo el error')
                }
                dispatch(setBackdropOpen(false))
            })
            .finally(() => {
                dispatch(setBackdropOpen(false))
            })
        }
    }

    const handleClick = () => {
        dispatch(createProject());
    }
    
    useEffect( () => {
        console.log(id);
        if (id !== undefined) {
            dispatch(changeTittle(title))
            dispatch(getProjectData(id));
        } 
    }, [id]);

    return (
    <Box sx={{ justifyContent: 'center'}} >
        <Box sx={{ mt: 2, maxWidth: 'sm', ml: 'auto', mr: 'auto'}} >
            <Stack>
                <FormControl sx={{ m: 1 }} variant="outlined">
                    <TextField
                        id="outlined-adornment-name"
                        type={'text'}
                        value={formData.name.value}
                        error={formData.name.error}
                        helperText={formData.name.helperText}
                        onChange={handleChange('name')}
                        label="Nombre"
                    />
                </FormControl>

                <FormControl sx={{ m: 1 }} variant="outlined">
                    <TextField
                        id="outlined-adornment-desc"
                        type={'text'}
                        value={formData.desc.value}
                        error={formData.desc.error}
                        helperText={formData.desc.helperText}
                        onChange={handleChange('desc')}
                        label="Descripcion"
                    />
                </FormControl>
            </Stack>
            <Stack spacing={2}>
                <FormControl sx={{ m: 1 }} variant="outlined">
                    <Button variant="contained" onClick={handleClick}>{id ? 'Actualizar' : 'Crear'}</Button>
                </FormControl>
            </Stack>
        </Box>
    </Box>
    )
}