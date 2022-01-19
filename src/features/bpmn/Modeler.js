import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { errorHandleDefault, errorHandleForm } from 'utils';
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
    selectFormData
} from './modelerSlice';
import PropertiesDrawer from './PropertiesDrawer';
import { getDiagram, saveDiagram } from './modelerServices';
import Fab from '@mui/material/Fab';
import { selectProject } from 'features/diagrams/diagramsSlice';
import { FormControl, TextField } from '@mui/material';
import { views } from 'views';
import { changeTittle } from 'features/header/headerSlice';


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
    let eventBus = null;

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

    const saveUploadDiagram = () => {
        dispatch(setBackdropOpen(true));
        return async (dispatch) => {
            const data = await bpmnModeler.saveXML({ format: true });
            const name = formData.name.value;
            const desc = formData.desc.value;
            await saveDiagram(id, data.xml, project, name, desc, diagramPropierties)
            .then((result) => {
                dispatch(changeReload(false));
                dispatch(changeId(result.data.id));
                enqueueSnackbar(createEqueue(`Diagrama guardado correctamente`, 'success'));
            })
            .catch((error) => {
                if (error.response){
                    if (errorHandleDefault(error.response, enqueueSnackbar)) return;
                    else dispatch(setFormData(errorHandleForm(error.response, enqueueSnackbar, formData)));
                }
                else console.log(error);
                dispatch(setBackdropOpen(false));
            })
            .finally(() => {
                dispatch(setBackdropOpen(false));
            })
        }
    }

    const handleClickSave = () => {
        dispatch(saveUploadDiagram());
    }

    const handleClickReturn = () => {
        dispatch(changeId(undefined));
        dispatch(changeCurrentView(views.DIAGRAMS));
    }

    React.useEffect(() => {
        if (bpmnModeler !== null){
            bpmnModeler.on('import.done', (event) => {
                const { error, warnings  } = event;
                if (error) return handleError(error);
                bpmnModeler.get('canvas').zoom('fit-viewport');
                return handleShown(warnings);
            });
            eventBus = bpmnModeler.get('eventBus');
            var events = [
                //'element.hover',
                //'element.out',
                'element.click',
                //'element.dblclick',
                //'element.mousedown',
                //'element.mouseup'
            ];
    
            events.forEach(function(event) {
                eventBus.on(event, function(e) {
                    console.log(event, 'on', e.element);
                });
            });
    
            bpmnModeler.on('selection.changed', function(e) {
                const newSelection = e.newSelection;
                if (newSelection != undefined && newSelection.length == 1) dispatch(changeSelectedItem(newSelection[0].id));
                else dispatch(changeSelectedItem(''));
            });
    
            bpmnModeler.on('element.changed', function(e) {
                console.log(e);
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
                    if (error.response){
                        if (errorHandleDefault(error.response, enqueueSnackbar)) return;
                    }
                    else {
                        console.log(console.error());
                    }
                })
                .finally(() => {
                    dispatch(setBackdropOpen(false))
                })
            }
        }
    }

    React.useEffect( () => {
        if (id !== undefined && reload) {
            dispatch(getDiagramData(id));
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
        bottom: 100,
    } :
    {
        ...baseFabStyle,
        top: 100,
    }

    const fabStyle2 = selectedItem == '' ? {
        ...baseFabStyle,
        bottom: 40,
    } :
    {
        ...baseFabStyle,
        top: 160,
    }

    return (
        <div>
            <div>
                <FormControl sx={{ m: 1, ml:0 }} variant="outlined">
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
            <PropertiesDrawer selectedItem={selectedItem} />
            <Fab variant="extended" sx={fabStyle} aria-label={'Guardar'} color={'primary'} onClick={handleClickSave}>
                <SaveIcon />
                Guardar
            </Fab>
            <Fab variant="extended" sx={fabStyle2} aria-label={'Guardar'} color={'secondary'} onClick={handleClickReturn}>
                <ArrowBackIcon />
                Volver
            </Fab>
        </div>
    );

} 
