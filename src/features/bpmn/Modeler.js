import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import Modeler from 'bpmn-js/lib/Modeler.js';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { createEqueue, errorHandleDefault, errorHandleForm } from 'utils';
import { 
    setBackdropOpen, 
    enqueueSnackbar as enqueueSnackbarAction,
    changeCurrentView,
} from 'features/frame/mainFrameSlice';
import {
    changeDiagramXML,
    selectDiagramXML,
    selectSelectedItem,
    selectUrl,
    changeSelectedItem,
    selectDiagramPropierties,
    loadData,
    changeId,
    selectId,
    setFormData,
    selectFormData,
    changeArtifactPropierties,
    deleteArtifactPropierties
} from './modelerSlice';
import PropertiesDrawer from './PropertiesDrawer';
import {generateUs, getDiagram, getDiagramUserStories, saveDiagram} from './modelerServices';
import Fab from '@mui/material/Fab';
import { selectProject } from 'features/diagrams/diagramsSlice';
import {Box, FormControl, Grid, Modal, TextField} from '@mui/material';
import { views } from 'views';
import { changeTittle } from 'features/header/headerSlice';
import { AccountTree } from '@mui/icons-material';
import UserStoriesTable from "./UserStoriesTable";
import Button from "@mui/material/Button";
import UserStoryDetail from "./UserStoryDetail";


export default function BpmnModeler() {
    const diagramXML = useSelector(selectDiagramXML);
    const formData = useSelector(selectFormData);
    const selectedItem = useSelector(selectSelectedItem);
    const url = useSelector(selectUrl);
    const id = useSelector(selectId);
    const dispatch = useDispatch();
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
    const containerRef = React.createRef();
    const project = useSelector(selectProject);
    const diagramPropierties = useSelector(selectDiagramPropierties);
    const [ bpmnModeler, changeBpmnModeler] = useState(null);
    const [ reload, changeReload] = useState(true);
    const [updateSelectedLabel, changeUpdateSelectedLabel] = useState({f: () => {}})
    const [ userStoriesData , setUserStoriesData] = useState([]);
    const [ selectedUserStoryData , setSelectedUserStoryData] = useState({});

    const displayDiagram = () => {
        if (diagramXML == '') console.log('Vacio');
        else bpmnModeler.importXML(diagramXML);
    }

    const onChangeProp = (prop) => (event) => {
        dispatch(setFormData({
            ...formData,
            [prop]: {
                ...formData[prop],
                value: event.target.value
            }
        }))
    }
    
    const fetchDiagram = (url) => {
        handleLoading();
    
        fetch(url)
          .then(response => response.text())
          .then(text => {
              dispatch(changeDiagramXML(text))
              displayDiagram(text)
            })
          .catch(err => handleError(err))
          .finally( () => dispatch(setBackdropOpen(false)));
    }

    const handleLoading = () => {
        dispatch(setBackdropOpen(true));
    }
    
    const handleError = (err) => {
        dispatch(setBackdropOpen(false));
        console.log(err);
        err && enqueueSnackbar({
            key: new Date().getTime() + Math.random(),
            message: `Hay errores`,
            options: {
                variant: 'error'
            },
            dismissed: false
        });
    }
    
    const handleShown = (warnings) =>{
        dispatch(setBackdropOpen(false));
        warnings.length && enqueueSnackbar({
            key: new Date().getTime() + Math.random(),
            message: `Hay alertas`,
            options: {
                variant: 'success'
            },
            dismissed: false
        });
    }

    const generateUsDiagram = () => {
        dispatch(setBackdropOpen(true));
        return async (dispatch) => {
            await generateUs(id)
            .then(async (result) => {
                console.log(result);
                await getDiagramUserStories(id).then((res) => {
                    const data = res.data;
                    setUserStoriesData(data)
                  }
                );
                enqueueSnackbar(createEqueue(result.data.message, 'success'));
            })
            .catch((error) => {
                let defaultHadled = true
                if (!error.response) console.log(error);
                else defaultHadled = errorHandleDefault(error.response, enqueueSnackbar);
            })
            .finally(() => {
                dispatch(setBackdropOpen(false));
            })
        }
    }

    const saveUploadDiagram = () => {
        dispatch(setBackdropOpen(true));
        return async (dispatch) => {
            const data = await bpmnModeler.saveXML({ format: true });
            const name = formData.name.value;
            const desc = formData.desc.value;
            await saveDiagram(id, data.xml, project, name, desc, diagramPropierties)
            .then((result) => {
                changeReload(false);
                dispatch(changeId(result.data.id));
                enqueueSnackbar(createEqueue(`Diagrama guardado correctamente`, 'success'));
            })
            .catch((error) => {
                let defaultHadled = true
                if (!error.response) console.log(error);
                else defaultHadled = errorHandleDefault(error.response, enqueueSnackbar);
                if (!defaultHadled) dispatch(setFormData(errorHandleForm(error.response, enqueueSnackbar, formData)));
            })
            .finally(() => {
                dispatch(setBackdropOpen(false));
            })
        }
    }



    const handleClickSave = () => {
        dispatch(saveUploadDiagram());
    }

    const handleClickGenerate = () => {
        setSelectedUserStoryData({})
        dispatch(generateUsDiagram());
    }
    

    const handleClickReturn = () => {
        dispatch(changeId(undefined));
        dispatch(changeCurrentView(views.DIAGRAMS));
    }

    const handleRowSelected = (e, rowId) => {
        const userStories = userStoriesData.filter((e) => e.id === rowId);
        if (userStories.length != 1) return;
        setSelectedUserStoryData(userStories[0].data)

    }

    React.useEffect(() => {
        if (bpmnModeler !== null){
            bpmnModeler.on('import.done', (event) => {
                const { error, warnings  } = event;
                if (error) return handleError(error);
                bpmnModeler.get('canvas').zoom('fit-viewport');
                return handleShown(warnings);
            });
            const modeling = bpmnModeler.get('modeling');
            
            bpmnModeler.on('selection.changed', function(e) {
                let obj = {f: () => {}};
                let element = {id: ''};
                let newSelection = e.newSelection;
                if(newSelection.length == 1) element = newSelection[0];
                if(element.id != '') obj.f = (name) => modeling.updateLabel(element, name);
                dispatch(changeSelectedItem(element.id));
                changeUpdateSelectedLabel(obj);
            });
    
            bpmnModeler.on('element.changed', function(e) {
                if(!e.gfx && e.element.id) dispatch(deleteArtifactPropierties(e.element.id));
                if(!e.element.businessObject) return;
                const { id, name } = e.element.businessObject;
                if (name != undefined && name != '') dispatch(changeArtifactPropierties({
                    id: id,
                    propierty: 'name',
                    value: name
                }))
            });
    
            if (url && id === undefined) fetchDiagram(url);
            if (diagramXML !== '') displayDiagram();
        }
    }, [bpmnModeler, url, diagramXML]);

    const getDiagramData = (id) => {
        if (id !== undefined) {
            dispatch(setBackdropOpen(true))
            return async (dispatch) => {
                await getDiagram(id)
                .then((result) => {
                    dispatch(loadData(result.data.data));
                })
                .catch((error) => {
                    if (!error.response) console.log(error);
                    else (errorHandleDefault(error.response, enqueueSnackbar));
                })
                .finally(() => dispatch(setBackdropOpen(false)));
            }
        }
    }

    React.useEffect( () => {
        if (id !== undefined && reload) {
            dispatch(getDiagramData(id));
            getDiagramUserStories(id).then((res) => {
                  const data = res.data;
                  setUserStoriesData(data)
              }
            );
        } 
    }, [id]);

    React.useEffect(() => {
        const container = containerRef.current;
        dispatch(changeTittle("Editar diagrama"))
        changeBpmnModeler(
            new BpmnJS({
                container,
                keyboard: {
                    bindTo: document
                }
            })
        );
    }, []);

    const baseFabStyle = {
        position: 'absolute',
        right: 50,
    }
    
    const fabStyle = selectedItem == '' ? {
        ...baseFabStyle,
        bottom: 160,
    } :
    {
        ...baseFabStyle,
        top: 40,
    }

    const fabStyle2 = selectedItem == '' ? {
        ...baseFabStyle,
        bottom: 100,
    } :
    {
        ...baseFabStyle,
        top: 100,
    }

    const fabStyle3 = selectedItem == '' ? {
        ...baseFabStyle,
        bottom: 40,
    } :
    {
        ...baseFabStyle,
        top: 160,
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "70%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        overflow:'scroll',
        height:'80%',
    };

    return (
        <div>
            { userStoriesData.length != 0 && <Modal
              open={open}
              onClose={handleClose}
            >
                <Box sx={{ ...modalStyle, width: "80%"}}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Grid container >
                                <UserStoriesTable rows={userStoriesData} handleRowSelected={handleRowSelected}/>
                            </Grid>
                        </Grid>
                        { Object.keys(selectedUserStoryData).length > 0 &&
                          <Grid item xs={6}>
                              <UserStoryDetail {...selectedUserStoryData} />
                          </Grid>
                        }
                    </Grid>
                </Box>
            </Modal>
            }
            <Grid container sx={{ mt: 1}} spacing={2}>
                <Grid item xs={6}>
                    <div>
                        <FormControl sx={{ m: 1}} variant="outlined">
                            <TextField
                              id="outlined-multiline-static"
                              label="Nombre"
                              value={formData.name.value}
                              error={formData.name.error}
                              helperText={formData.name.helperText}
                              onChange={onChangeProp("name")}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1}} variant="outlined" >
                            <TextField
                              id="outlined-multiline-static"
                              label="Descripcion"
                              value={formData.desc.value}
                              error={formData.desc.error}
                              helperText={formData.desc.helperText}
                              onChange={onChangeProp("desc")}
                            />
                        </FormControl>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    {userStoriesData.length > 0 && <Fab variant="extended" aria-label={'Consultar historias'} color={'info'} onClick={handleOpen}>
                        <AccountTree />
                        Consultar historias
                    </Fab>}
                </Grid>
            </Grid>

            <div className="react-bpmn-diagram-container" ref={ containerRef } style={
                {
                    height: '800px',
                    width: '100%',
                    marginTop: '5px',
                    overflow: 'hidden',
                    padding: 0,
                    borderStyle: 'double'
                }
            }></div>
            <PropertiesDrawer selectedItem={selectedItem} updateSelectedLabel={updateSelectedLabel} />
            <Fab variant="extended" sx={fabStyle} aria-label={'Guardar'} color={'primary'} onClick={handleClickSave}>
                <SaveIcon />
                Guardar
            </Fab>
            <span style={fabStyle2}>
                <Fab variant="extended"  aria-label={'Guardar'} color={'success'} onClick={handleClickGenerate}>
                    <AccountTree />
                    Generar historias
                </Fab>
                {userStoriesData.length > 0 && <Fab variant="extended" aria-label={'Consultar historias'} color={'info'} onClick={handleOpen}>
                    <AccountTree />
                    Consultar historias
                </Fab>}
            </span>
            <Fab variant="extended" sx={fabStyle3} aria-label={'Guardar'} color={'secondary'} onClick={handleClickReturn}>
                <ArrowBackIcon />
                Volver
            </Fab>
        </div>
    );
}
