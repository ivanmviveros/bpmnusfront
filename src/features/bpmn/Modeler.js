import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { errorHandleDefault } from 'utils';
import { 
    setBackdropOpen, 
    enqueueSnackbar as enqueueSnackbarAction,
} from 'features/frame/mainFrameSlice';
import {
    changeDiagramXML,
    selectDiagramXML,
    selectSelectedItem,
    selectUrl,
    changeSelectedItem
} from './modelerSlice';
import PropertiesDrawer from './PropertiesDrawer';
import { uploadDiagram } from './modelerServices';

export default function BpmnModeler() {
    const diagramXML = useSelector(selectDiagramXML);
    const selectedItem = useSelector(selectSelectedItem);
    const url = useSelector(selectUrl);
    const dispatch = useDispatch();
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
    const containerRef = React.createRef();
    let BpmnModeler = null;
    let eventBus = null;

    const displayDiagram = (diagramXML) => {
        BpmnModeler.importXML(diagramXML);
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
            const data = await BpmnModeler.saveXML({ format: true });
            await uploadDiagram(data)
            .then((result) => {
                console.log(result);
                enqueueSnackbar(createEqueue(`Diagrama guardado correctamente`, 'success'));
            })
            .catch((error) => {
                if (error.response){
                    if (errorHandleDefault(error.response, enqueueSnackbar)) return;
                }
                else console.log(error);
                dispatch(setBackdropOpen(false));
            })
            .finally(() => {
                dispatch(setBackdropOpen(false));
            })
        }
    }

    React.useEffect(() => {
        const container = containerRef.current;
        BpmnModeler = new BpmnJS({ 
            container,
            keyboard: {
                bindTo: document
            }
        });

        BpmnModeler.on('import.done', (event) => {
            const { error, warnings  } = event;
            if (error) return handleError(error);
            BpmnModeler.get('canvas').zoom('fit-viewport');
            return handleShown(warnings);
        });
        eventBus = BpmnModeler.get('eventBus');
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

        BpmnModeler.on('selection.changed', function(e) {
            const newSelection = e.newSelection;
            if (newSelection != undefined && newSelection.length == 1) dispatch(changeSelectedItem(newSelection[0].id));
            else dispatch(changeSelectedItem(''));
        });

        BpmnModeler.on('element.changed', function(e) {
            console.log(e);
        });

        if (url) fetchDiagram(url);
        if (diagramXML != '') displayDiagram(diagramXML);
    }, [url]);


    return (
        <div>
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
        </div>
    );

} 
