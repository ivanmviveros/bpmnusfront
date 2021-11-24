import { Button, FormControl, FormHelperText, Grid, InputLabel } from "@mui/material"
import { enqueueSnackbar, setBackdropOpen } from "features/frame/mainFrameSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { 
    enqueueSnackbar as enqueueSnackbarAction
} from 'features/frame/mainFrameSlice';
import { errorHandleDefault } from "utils";
import { selectFormData, setFormData } from "./projectFormSlice"
import { addProject, getProject } from "./projectsServices";



export const ProjectsForm = (props) => {
    const { id } = props;
    const formData = useSelector(selectFormData);
    const dispatch = useDispatch();
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));

    const handleChange = (prop) => (event) => {
        dispatch(setFormData({
            ...formData,
            [prop]: event.target.value
        }))
    };

    const getProjectData = (id) => {
        dispatch(setBackdropOpen(true))
        return async (dispatch) => {
            await getProject(id)
            .then((result) => {
                dispatch(setFormData(result.data));
            })
            .catch((error) => errorHandleDefault(error, enqueueSnackbar))
            .finally(() => {
                dispatch(setBackdropOpen(false))
            })
        }
    }

    const createProject = () => {
        dispatch(setBackdropOpen(true))
        return async (dispatch) => {
            await addProject(formData)
            .then((result) => {
                enqueueSnackbar({
                    key: new Date().getTime() + Math.random(),
                    message: `Proyecto creado correctamente`,
                    options: {
                        variant: 'success'
                    },
                    dismissed: false
                });
            })
            .catch((error) => errorHandleDefault(error, enqueueSnackbar))
            .finally(() => {
                dispatch(setBackdropOpen(false))
            })
        }
    }

    useEffect( () => {
        if (id !== null) getProjectData(id);
    }, [id]);

    return <Grid container>
        <Grid item xs={12} md={6} xl={3}>
            <FormControl>
                <InputLabel htmlFor='nameInput'>Nombre</InputLabel>
                <Input id='name' aria-described-by='helperName' value={formData.name} onchange={handleChange('name')}/>
                <FormHelperText id='helperName'>Nombre del proyecto</FormHelperText>
            </FormControl>
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
            <FormControl>
                <InputLabel htmlFor='descInput'>Descripción</InputLabel>
                <Input id='desc' aria-described-by='helperDesc' value={formData.desc} onchange={handleChange('desc')}/>
                <FormHelperText id='helperDesc'>Descripción del proyecto</FormHelperText>
            </FormControl>
        </Grid>
        <Grid item xs={12}>
            <Button>Crear</Button>
        </Grid>
    </Grid>
}